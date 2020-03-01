import MatchWorker from "worker-loader?inline!./worker.js";

export default class HandwritingRecognition {
  constructor(options) {
    this.onResult = options.onResult;
    this.threshold = options.threshold || 0.8;
    this.script = options.script;
    this.matchers = [];
    this.matcherIndex = 0;
    this.initWorkers(options.threads || 5);
    this.requestQueue = [];
  }

  initWorkers(threads) {
    for (let i = 0; i < threads; i++) {
      let matcher = MatchWorker();
      matcher.onmessage = message => this.onMatchResult(message.data);
      this.matchers.push(matcher);
    }
  }

  queue(stroke) {
    if (stroke.points.length <= 1) return;
    let matcher = this._getMatcherWorker();
    let id = +new Date();
    let strokes = [stroke.points];
    // If this is inside the bounding box of previous request, try multi stroke
    if (this.requestQueue.length > 0) {
      let prevStroke = this.requestQueue.slice(-1).pop();
      if (this.isBoundingBoxIntersecting(prevStroke, stroke)) {
        strokes = [prevStroke.points, stroke.points];
      }
    }
    matcher.postMessage({
      script: this.script,
      threshold: this.threshold,
      strokes: strokes,
      id: id
    });
    this.requestQueue.push(stroke);
    this.matcherIndex++;
  }

  isBoundingBoxIntersecting(stroke1, stroke2) {
    // Stroke 1 happened before stroke2
    if (stroke2.box.x2 < stroke1.box.x2 || stroke2.box.x1 < stroke1.box.x2) {
      // Horizontal intersection
      return true;
    }
    // We dont care vertical intersection?
    return false;
  }

  _getMatcherWorker() {
    this.matcherIndex =
      this.matcherIndex >= this.matchers.length ? 0 : this.matcherIndex;
    return this.matchers[this.matcherIndex];
  }

  onMatchResult(result) {
    this.onResult(result.candidates);
  }
}
