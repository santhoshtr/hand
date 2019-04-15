var scripts = []

function init () {
  var tabs = M.Tabs.init(document.querySelectorAll('.tabs'), {
  })
  tabs = M.Tabs.getInstance(document.querySelectorAll('.tabs')[0])
  tabs.select('malayalam')
  var elems = document.querySelectorAll('.collapsible')
  var collapsibles = M.Collapsible.init(elems, {})
  loadScript('malayalam').then(() => renderData('malayalam'))
  loadScript('tamil').then(() => renderData('tamil'))
}

function renderData (script) {
  let scriptdata = scripts[script]
  let collapsible = document.querySelectorAll(`#${script} > .collapsible`)[0]
  for (let pattern in scriptdata) {
    let item = document.createElement('li')
    let header = document.createElement('div')
    header.className = 'collapsible-header'
    let icon = document.createElement('i')
    icon.innerText = 'brush'
    icon.className = 'material-icons'
    header.appendChild(icon)
    header.appendChild(document.createTextNode(pattern))
    item.appendChild(header)

    let itemData = document.createElement('div')
    itemData.className = 'collapsible-body'
    let canvas = document.createElement('canvas')
    canvas.className = 'yellow lighten-5'
    canvas.width = document.body.clientWidth * 0.9
    canvas.height = 500
    let pad = new WritingPad({
      canvas: canvas
    })
    drawData(pad, scriptdata[pattern].strokes)
    itemData.appendChild(canvas)
    // itemData.innerText = JSON.stringify(scriptdata[pattern].strokes)
    item.appendChild(itemData)
    collapsible.appendChild(item)
  }
}

function drawData (pad, data) {
  pad.setData(data)
  pad.draw()
}

function loadScript (script) {
  return fetch(`src/data/${script}.json`).then(r => r.json())
    .then(data => {
      scripts[script] = data
    })
    .catch(e => console.error(`Failed loading ${script}`))
}

window.addEventListener('load', init)
