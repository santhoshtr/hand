
const simplify = require('simplify-js')
const fs = require('fs')

let rawData = fs.readFileSync('/dev/stdin', 'utf8')
let trainingData = JSON.parse(rawData)
let cleanedUpData = {}
for (let key in trainingData) {
  let samples = trainingData[key].samples
  samples = samples.map(
    (sample) => {
      return {
        'strokes': sample.strokes.map((stroke) => {
          return simplify(stroke, 10, true)
        })
      }
    })
  cleanedUpData[key] = { samples }
}
process.stdout.write(JSON.stringify(cleanedUpData, null, 2) + '\n')
