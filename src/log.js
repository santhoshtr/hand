export default function (content) {
  let logStr
  const $console = document.getElementById('console')

  if (!$console) {
    console.log(content)
  }
  if (content === undefined) {
    $console.innerHTML = ''
    return
  }
  if (typeof content === 'object') {
    logStr = JSON.stringify(content)
  } else {
    logStr = content
  }
  $console.innerHTML = $console.innerHTML + '<br>' + logStr
};
