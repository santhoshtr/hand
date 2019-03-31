import { shapeSimilarity } from 'curve-matcher'

export default class Match {
  constructor (data, threshold) {
    this.data = data
    this.threshold = threshold
  }

  run (stroke) {
    let candiates = []
    if (!stroke || !stroke.length) return
    let keys = Object.keys(this.data)
    for (let i = 0; i < keys.length; i++) {
      let score = this.match(stroke, this.data[keys[i]].points)
      if (score >= this.threshold) {
        let pattern = keys[i]
        candiates.push({
          pattern: pattern,
          score: score
        })
      }
    }
    return candiates.sort((a, b) => parseFloat(b.score) - parseFloat(a.score))
  }

  match (path, candidatePath) {
    return shapeSimilarity(path, candidatePath)
  }

  distance (p1, p2) {
    var dx = p1.x - p2.x
    var dy = p1.y - p2.y
    return parseInt(Math.sqrt(dx * dx + dy * dy), 10)
  }
}
