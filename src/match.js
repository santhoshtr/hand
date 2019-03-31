import { shapeSimilarity } from 'curve-matcher'

export default class Match {
  constructor (data) {
    this.data = data
    this.threshold = 0.85
  }

  run (stroke) {
    let result = {
      score: 0
    }
    if (!stroke || !stroke.length) return
    let keys = Object.keys(this.data)
    for (let i = 0; i < keys.length; i++) {
      // console.debug('Matching ' + keys[i])
      let score = this.match(stroke, this.data[keys[i]].points)
      if (score >= this.threshold && score >= result.score) {
        let pattern = keys[i]
        result = {
          pattern: pattern,
          score: score
        }
        if (score === 1) {
          break
        }
      }
    }
    return result
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
