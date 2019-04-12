import {
  shapeSimilarity
} from 'curve-matcher'
import MalayalamData from './data/malayalam.json'
import TamilData from './data/tamil.json'

const ScriptData = {
  'malayalam': MalayalamData,
  'tamil': TamilData
}

export default class Match {
  constructor (script, threshold) {
    this.data = ScriptData[script]
    this.threshold = threshold
  }

  run (strokes) {
    let candiates = []
    console.log(strokes)
    if (!strokes || strokes.length <= 1) return
    let keys = Object.keys(this.data)
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      let candidateStrokes = this.data[key].strokes
      for (let j = 0; j < candidateStrokes.length; j++) {
        let candidateStroke = candidateStrokes[j]
        let score = this.match(strokes, candidateStroke)
        if (score >= this.threshold) {
          let pattern = key
          candiates.push({ pattern, score })
        }
      }
    }
    return candiates.sort((a, b) => parseFloat(b.score) - parseFloat(a.score))
  }

  match (path, candidatePath) {
    return shapeSimilarity(path, candidatePath, {
      restrictRotationAngle: 0.5235988// 30 degree in radians
    })
  }
}
