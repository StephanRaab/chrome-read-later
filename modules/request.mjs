import '../modules_web/jquery.min.js'

export async function getTitle(url) {
  const html = await getHtml(url)
  return html.filter('title').text() || url
}

export async function getHtml(url) {
  try {
    const response = await fetch(url)
    const html = await response.text()
    return $(html)
  } catch (e) {
    return $('')
  }
}

export async function getFavIcon(url) {
  return await toBase64(`https://s2.googleusercontent.com/s2/favicons?domain=${url}`)
}

async function toBase64(url) {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return await fileReader(blob)
  } catch (e) {
    return '../images/32x32gray.png'
  }
}

async function fileReader(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}