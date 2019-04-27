import {
  shapeSimilarity
} from 'curve-matcher'
import simplify from 'simplify-js'
import malayalam from './data/malayalam.json'
import tamil from './data/tamil.json'

const scriptData = { malayalam, tamil }
const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length
const sortByScore = (a, b) => parseFloat(b.score) - parseFloat(a.score)
const simpifyStrokes = (strokes) => strokes.map((stroke) => simplify(stroke, 5, true))

export default class Match {
  constructor (script, threshold) {
    this.data = scriptData[script]
    this.threshold = threshold
  }

  run (strokes) {
    let candidates = []

    if (!strokes) return candidates

    strokes = Array.isArray(strokes[0]) ? strokes : [strokes]

    // Simplify the curve with 5px tolerance
    let simplifiedStrokes = simpifyStrokes(strokes)

    for (let key in this.data) {
      let score = this.matchLetter(
        simplifiedStrokes,
        this.data[key].samples
      )
      if (score) {
        candidates.push({ pattern: key, score })
        // Good score. Finish here
        if (score > 0.90) { break }
      }
    }
    // Sort by descending order of scores
    return candidates.sort(sortByScore)
  }

  matchLetter (letterData, samples) {
    for (let i = 0; i < samples.length; i++) {
      let sample = samples[i]
      if (letterData.length !== sample.strokes.length) {
        continue
      }
      let strokeScores = []
      let matching = letterData.every((stroke, index) => {
        let score = this.match(stroke, sample.strokes[index])
        if (score >= this.threshold) {
          strokeScores.push(score)
          return true
        }
      })
      if (matching) {
        // return average score
        return average(strokeScores)
      }
    }

    return 0
  }

  match (path, candidatePath) {
    return shapeSimilarity(path, candidatePath, {
      restrictRotationAngle: 0.5235988// 30 degree in radians
    })
  }
}
