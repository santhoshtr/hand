import Match from './match'

/* global self */
self.onmessage = (message) => {
  const matcher = new Match(message.data.script, message.data.threshold)

  let results = {
    candidates: matcher.run(message.data.strokes),
    id: message.data.id
  }
  self.postMessage(results)
}
