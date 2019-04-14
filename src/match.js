import {
  shapeSimilarity
} from 'curve-matcher'
import simplify from 'simplify-js'
import malayalam from './data/malayalam.json'
import tamil from './data/tamil.json'

const scriptData = { malayalam, tamil }
const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length
const sortByScore = (a, b) => parseFloat(b.score) - parseFloat(a.score)
const simpifyStrokes = (strokes) => strokes.map((stroke) => simplify(stroke, 5, false))

export default class Match {
  constructor (script, threshold) {
    this.data = scriptData[script]
    this.threshold = threshold
  }

  run (strokes) {
    let candiates = []

    if (!strokes) return candiates

    strokes = Array.isArray(strokes[0]) ? strokes : [strokes]

    // Simplify the curve with 5px tolerance
    let simplifiedStrokes = simpifyStrokes(strokes)
    console.log(JSON.stringify({ 'strokes': simplifiedStrokes }))

    for (let key in this.data) {
      let score = this.matchLetter(
        simplifiedStrokes,
        this.data[key].strokes,
        this.data[key].variants
      )
      if (score) {
        candiates.push({ pattern: key, score })
      }
    }

    // Sort by descending order of scores
    return candiates.sort(sortByScore)
  }

  matchLetter (letterData, candidateStrokes, variants) {
    if (letterData.length === candidateStrokes.length) {
      let strokeScores = []
      let matching = letterData.every((stroke, index) => {
        let score = this.match(stroke, candidateStrokes[index])
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

    if (variants) {
      for (let i = 0; i < variants.length; i++) {
        let score = this.matchLetter(letterData, variants[i].strokes)
        if (score) return score
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
