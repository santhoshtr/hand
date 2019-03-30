import log from './log'
import levenshteinDistance from './levenshteinDistance'

export default class Match {
  constructor (data) {
    this.data = data
    this.threshold = 0.8
  }

  run (stroke) {
    var i
    var keys
    var score
    var result = {
      score: 0
    }
    var pattern
    keys = Object.keys(this.data)
    for (i = 0; i < keys.length; i++) {
      log('Matching ' + keys[i])
      score = this.match(stroke, this.data[keys[i]].points)
      if (score >= this.threshold && score >= result.score) {
        pattern = keys[i]
        result = {
          pattern: pattern,
          score: score
        }
        if (score === 1) {
          break
        }
      }
      pattern = undefined
    }
    return result
  }

  match (path, candidatePath) {
    let penalty = 0
    let lengthDiff
    let ld = levenshteinDistance(path, candidatePath, (a, b) => this.distance(a, b) <= 100)
    log('levenshteinDistance: ' + ld)
    if (ld < path.length / 3) {
      return 1 - (ld / path.length)
    }
    if (path.length !== candidatePath.length) {
      lengthDiff = candidatePath.length - path.length
      penalty += 0.1 * Math.abs(lengthDiff)
    }
    if (penalty > this.threshold / 2) {
      // Early return
      return 1 - penalty
    }
    let p2
    for (let i = 0; i < path.length; i++) {
      let p1 = path[i]
      p2 = candidatePath[i] || p2 // Previous p2
      let distance = this.distance(p1, p2)
      log(' >> ' + JSON.stringify(p1) + ' & ' + JSON.stringify(p2) + ': distance = ' + distance)
      penalty += 0.001 * distance
    }
    return 1 - penalty
  }

  distance (p1, p2) {
    var dx = p1.x - p2.x
    var dy = p1.y - p2.y
    return parseInt(Math.sqrt(dx * dx + dy * dy), 10)
  }
}
