import Match from './match'

self.onmessage = (message) => {
  const matcher = new Match(message.data.scriptData, message.data.threshold)

  let results = matcher.run(message.data.strokes)
  self.postMessage(results)
}
