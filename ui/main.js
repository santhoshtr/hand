let hwr, pad, timer

const TIMEOUT = 1500

function onResult (results) {
  let candidates = document.getElementsByClassName('candidates')[0]
  if (results && results.length) {
    candidates.innerHTML = ''
    document.getElementById('result').value += results[0].pattern
    console.log('Match: ' + JSON.stringify(results[0]))
    for (let i = 1; i < results.length; i++) {
      let button = document.createElement('button')
      button.innerText = results[i].pattern
      button.title = results[i].score
      candidates.appendChild(button)
    }
  } else {
    candidates.innerHTML = 'No match'
  }
}

function onLanguageChange () {
  hwr = getRecognizer(document.getElementsByClassName('language')[0].value, onResult)
}

function onPenDown () {
  console.log('pendown')
  if (timer) {
    clearTimeout(timer)
  }
}

function onPenUp (data) {
  hwr.queue(data)
  timer = setTimeout(onTimeout, TIMEOUT)
}

function onTimeout () {
  pad.clear()
}

function getRecognizer (script, onResult) {
  // eslint-disable-next-line no-undef
  return new HandwritingRecognition({
    threshold: 0.85,
    script,
    onResult
  })
}

function init () {
  let canvas = document.getElementsByClassName('pad')[0]
  let script = document.getElementsByClassName('language')[0].value
  canvas.width = document.body.clientWidth
  canvas.height = document.body.clientHeight * 0.4
  document.getElementById('result').value = ''
  // eslint-disable-next-line no-undef
  pad = new WritingPad({ canvas, onPenDown, onPenUp })
  // eslint-disable-next-line no-undef
  hwr = getRecognizer(script, onResult)

  document.getElementsByClassName('space')[0].onclick = () => {
    document.getElementById('result').value = document.getElementById('result').value + ' '
  }

  document.getElementsByClassName('backspace')[0].onclick = () => {
    document.getElementById('result').value = document.getElementById('result').value.slice(0, -1)
  }

  document.getElementsByClassName('back')[0].onclick = () => {
    pad.previous()
  }

  document.getElementsByClassName('language')[0].onchange = onLanguageChange
}

window.addEventListener('load', init)
