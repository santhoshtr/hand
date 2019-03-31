export default function (content) {
  let logStr
  const consoleEl = document.getElementById('console')

  if (content === undefined) {
    return
  }
  if (typeof content === 'object') {
    logStr = JSON.stringify(content)
  } else {
    logStr = content
  }
  if (!consoleEl) {
    console.log(logStr)
  } else {
    consoleEl.innerHTML = consoleEl.innerHTML + '<br>' + logStr
  }
};
