/* global M, WritingPad */
var scripts = []

function init () {
  var tabs = M.Tabs.init(document.querySelectorAll('.tabs'))
  tabs = M.Tabs.getInstance(document.querySelectorAll('.tabs')[0])
  tabs.select('malayalam')
  var elems = document.querySelectorAll('.collapsible')
  M.Collapsible.init(elems, {})
  loadScript('malayalam').then(() => renderData('malayalam'))
  loadScript('tamil').then(() => renderData('tamil'))

  Array.from(document.querySelectorAll('.download')).forEach(link => {
    link.addEventListener('click', function (event) {
      download(this.dataset.script)
    })
  })
}

function renderData (script) {
  let scriptdata = scripts[script]
  let collapsible = document.querySelectorAll(`#${script} > .collapsible`)[0]
  for (let pattern in scriptdata) {
    let item = document.createElement('li')
    let header = document.createElement('div')
    header.className = 'collapsible-header'
    let icon = document.createElement('i')
    icon.innerText = 'gesture'
    icon.className = 'material-icons'
    header.appendChild(icon)
    header.appendChild(document.createTextNode(pattern))
    item.appendChild(header)

    let itemData = document.createElement('div')
    itemData.className = 'collapsible-body'

    renderSamples(script, pattern, itemData)
    item.appendChild(itemData)

    collapsible.appendChild(item)
  }
}

function renderSamples (script, pattern, itemData) {
  const scriptdata = scripts[script]
  let samples = scriptdata[pattern].samples

  let actions = document.createElement('div')
  actions.className = 'actions'
  let add = document.createElement('button')
  add.className = 'actions-add btn waves-effect waves-light'
  add.innerText = 'add'
  actions.appendChild(add)
  let remove = document.createElement('button')
  remove.className = 'actions-remove btn waves-effect waves-light'
  remove.innerText = 'remove'
  actions.appendChild(remove)

  itemData.appendChild(actions)

  for (let i = 0; i < samples.length; i++) {
    let sampleElement = document.createElement('label')
    sampleElement.className = 'row'
    let checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.name = pattern
    checkbox.value = i
    let labelText = document.createElement('span')
    labelText.innerText = 'Sample-' + i
    let canvas = document.createElement('canvas')
    canvas.className = 'yellow lighten-5 col s12'
    canvas.width = document.body.clientWidth * 0.9
    canvas.height = 500
    let pad = new WritingPad({
      canvas: canvas,
      readonly: true,
      showCoords: true,
      strokeOptions: {
        lineCap: 'round',
        lineWidth: 2,
        strokeStyle: '#009dec'
      }
    })
    drawData(pad, samples[i])
    sampleElement.appendChild(checkbox)
    sampleElement.appendChild(labelText)
    sampleElement.appendChild(canvas)
    itemData.appendChild(sampleElement)
  }
}

function drawData (pad, data) {
  pad.setData(data.strokes)
  pad.draw()
}

function download (script) {
  var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scripts[script], null, 2))
  var downloadAnchorNode = document.createElement('a')
  downloadAnchorNode.setAttribute('href', dataStr)
  downloadAnchorNode.setAttribute('download', script + '.json')
  document.body.appendChild(downloadAnchorNode) // required for firefox
  downloadAnchorNode.click()
  downloadAnchorNode.remove()
  return false
}

function loadScript (script) {
  return fetch(`src/data/${script}.json`).then(r => r.json())
    .then(data => {
      scripts[script] = data
    })
    .catch(e => console.error(`Failed loading ${script}`))
}

window.addEventListener('load', init)
