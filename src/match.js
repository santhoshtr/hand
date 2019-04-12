import {
  shapeSimilarity
} from 'curve-matcher'
import simplify from 'simplify-js'
import malayalam from './data/malayalam.json'
import tamil from './data/tamil.json'

const ScriptData = { malayalam, tamil }

export default class Match {
  constructor (script, threshold) {
    this.data = ScriptData[script]
    this.threshold = threshold
  }

  run (strokes) {
    let candiates = []
    // Simplify the curve with 5px tolerance
    let simplifiedStroke = simplify(strokes, 5, false)
    console.log(JSON.stringify(simplifiedStroke))

    if (!strokes || strokes.length <= 1) {
      return
    }

    let keys = Object.keys(this.data)

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      let candidateStrokes = this.data[key].strokes

      for (let j = 0; j < candidateStrokes.length; j++) {
        let candidateStroke = candidateStrokes[j]
        let score = this.match(simplifiedStroke, candidateStroke)

        if (score >= this.threshold) {
          candiates.push({ pattern: key, score })
        }
      }
    }
    // Sort by descending order of scores
    return candiates.sort((a, b) => parseFloat(b.score) - parseFloat(a.score))
  }

  match (path, candidatePath) {
    return shapeSimilarity(path, candidatePath, {
      restrictRotationAngle: 0.5235988// 30 degree in radians
    })
  }
}
