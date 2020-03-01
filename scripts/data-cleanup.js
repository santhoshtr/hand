
const fs = require('fs')

let rawData = fs.readFileSync('/dev/stdin', 'utf8')
let trainingData = JSON.parse(rawData)
let cleanedUpData = {}
for (let key in trainingData) {
  let samples = [
    { strokes: trainingData[key].strokes }
  ]
  if (trainingData[key].variants) {
    samples.push({ strokes: trainingData[key].variants.map((item) => item.strokes) })
  }
  cleanedUpData[key] = { samples }
}
process.stdout.write(JSON.stringify(cleanedUpData, null, 2) + '\n')
