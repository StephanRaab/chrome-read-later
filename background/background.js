import * as commands from '../modules/chrome/commands.mjs'
import * as contextMenus from '../modules/chrome/contextMenus.mjs'
import * as runtime from '../modules/chrome/runtime.mjs'
import * as tabs from '../modules/chrome/tabs.mjs'
import * as action from './action.js'
import * as localStore from '../modules/localStore/localStore.mjs'

commands.onCommand(action.savePage)
runtime.onMessage(({ message, data }) => {
    const func = {
        'open': () => action.openPage(data),
        'dele': () => localStore.pushToArray(data.key, data.url)
    }[message]

    func && func()
})
runtime.onPopupDisconnect(action.removeDeletePages)

contextMenus.onClicked(async (selection, tab) => {
    selection.linkUrl
        ? await action.saveSelection(tab, selection)
        : await action.savePage()
})

contextMenus.create({
    title:    'Save to Read later',
    contexts: ['all'],
    id:       'chrome-read-later.willbc.cn',
})

runtime.onInstall(async () => {
    await tabs.create('https://github.com/willbchang/chrome-read-later#readme')
})

runtime.onUpdate(async details => {
    if (details.previousVersion[0] < '9' && runtime.getCurrentVersion() >
        '8.0.0') {
        await action.migrateStorage()
    }
})
