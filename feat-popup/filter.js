import * as action from './action.js'

export const url = target => {
  return {
    A:    () => target.href,
    LI:   () => target.childNodes[3].href,
    SPAN: () => target.previousSibling.previousSibling.href,
    IMG:  () => target.nextElementSibling.href,
  }[target.tagName]()
}


export const li = target => {
  return {
    LI:   () => $(target),
    IMG:  () => $(target.parentNode),
    A:    () => $(target.parentNode),
    SPAN: () => $(target.parentNode),
  }[target.tagName]()
}

export const key = event => {
  const {key, metaKey, altKey} = event
  const lastKey = localStorage.getItem('lastKey')

  const keyBindings = {
    Enter:     metaKey ? 'Meta + Enter' : altKey ? 'Alt + Enter' : 'Enter',
    Backspace: 'Backspace',
    ArrowUp:   metaKey ? 'Meta + ArrowUp' : 'ArrowUp',
    ArrowDown: metaKey ? 'Meta + ArrowDown' : 'ArrowDown',
    z:         metaKey ? 'Meta + z' : 'z',
    j:         'j',
    k:         'k',
    g:         lastKey === 'g' ? 'gg' : 'g',
    G:         'G',
    d:         lastKey === 'd' ? 'dd' : 'd',
    u:         'u',
    y:         lastKey === 'y' ? 'yy' : 'y',
    p:         'p',
  }

  // Empty Selection on pressing expected key.
  if (key in keyBindings) document.getSelection().empty()

  localStorage.setItem('lastKey', keyBindings[key])
  return keyBindings[key]
}

export const keyAction = event => {
  // Avoid native arrow behavior, it overflows the focus behavior on long reading list.
  if (event.key.includes('Arrow')) event.preventDefault()

  // 1. This way still make action work if it loses focus by clicking the blank area.
  //    If it loses focus, event.target will be <body> instead of <li>.
  // 2. If delete the list to empty, press u won't able to do undo because current tag is BODY.
  //    This way makes the undo be able to continue.
  if (event.target.tagName === 'BODY' && event.key !== 'u')
    return $('#reading-list li:visible:first').trigger('focus')

  // 1. This way still make action work if it loses focus by right click text.
  //    If it loses focus, event.target will be <a> instead of <li>.
  // 2. If tag is BODY, the li() will produce an error the action will not able to proceed.
  //    This way make it continue to work.
  const target = event.target.tagName === 'BODY' ? '' : li(event.target)[0]
  return {
    Enter:              () => action.open({target}),
    'Meta + Enter':     () => action.open({target, active: false}),
    'Alt + Enter':      () => action.open({target, currentTab: true}),
    Backspace:          () => action.remove(target),
    'Meta + z':         () => action.restore(),
    'Meta + ArrowUp':   () => action.top(),
    'Meta + ArrowDown': () => action.bottom(),
    ArrowUp:            () => action.up(),
    ArrowDown:          () => action.down(target),
    j:                  () => action.down(target),
    k:                  () => action.up(),
    gg:                 () => action.top(),
    G:                  () => action.bottom(),
    dd:                 () => action.remove(target),
    u:                  () => action.restore(),
    yy:                 () => action.copy(target),
  }[key(event)]()
}

export const mouse = ({metaKey, altKey}) =>
  metaKey ? 'Meta + Click' : altKey ? 'Alt + Click' : 'Click'

export const mouseAction = (event) => {
  const {target} = event
  if (target.tagName === 'IMG') return action.remove(target)
  return {
    Click:          () => action.open({target}),
    'Meta + Click': () => action.open({target, active: false}),
    'Alt + Click':  () => action.open({target, currentTab: true}),
  }[mouse(event)]()
}
