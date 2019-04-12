
import MatchWorker from 'worker-loader?inline!./worker.js'

export default class HandwritingRecognition {
  constructor (options) {
    this.onResult = options.onResult
    this.threshold = options.threshold || 0.90
    this.script = options.script
    this.matchers = []
    this.matcherIndex = 0
    let threads = options.threads || 5
    for (let i = 0; i < threads; i++) {
      this.matchers.push(MatchWorker())
    }
  }

  queue (data) {
    this.matcherIndex = this.matcherIndex >= this.matchers.length ? 0 : this.matcherIndex
    if (data.points.length <= 1) return
    this.matchers[this.matcherIndex].postMessage({
      scriptData: this.script,
      threshold: this.threshold,
      strokes: data.points
    })
    this.matchers[this.matcherIndex].onmessage = (message) => {
      this.onResult(message.data)
    }
    this.matcherIndex++
  }
}
