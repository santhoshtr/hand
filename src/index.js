import Pad from './pad'
import simplify from 'simplify-js'
import Events from './events'
import Match from './match'
import PATTERNDATA from './malayalam.json'

export default class Mlhand {
  constructor (options) {
    this.canvasElement = options.canvas
    this.onResult = options.onResult
    this.threshold = options.threshold || 0.85
    this.events = new Events()
    this.pad = null
    this.debug = options.debug
    this.init()
  }

  init () {
    this.pad = new Pad({
      canvas: this.canvasElement,
      events: this.events
    })

    this.pad.listen()

    this.events.subscribe('/draw/pen/down', this.onPenDown.bind(this))
    this.events.subscribe('/draw/pen/up', this.onPenUp.bind(this))
  }

  onPenDown (data) {
    // new drawing
  }

  onPenUp (data) {
    let simplifiedPoints, translatedPoints
    if (!data.points.length) return
    if (this.debug) {
      simplifiedPoints = simplify(data.points, 1, true)
      console.debug('Simplifed ' + data.points.length + ' points to ' + simplifiedPoints.length + ' points.')
      let box = this.pad.getBoundingBox()
      translatedPoints = this.translate(simplifiedPoints, box)
      console.debug(JSON.stringify(translatedPoints))
    }
    this.pad.clear()
    let match = new Match(PATTERNDATA, this.threshold)
    let result = match.run(data.points)
    this.onResult(result)
  }

  translate (points, box) {
    let translatedPoints = []

    for (let i = 0; i < points.length; i++) {
      let p = points[i]
      translatedPoints.push({
        x: p.x - box.x1,
        y: p.y - box.y1
      })
    }
    return translatedPoints
  }
}
