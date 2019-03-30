import Pad from './pad'
import simplify from 'simplify-js'
import log from './log'
import Events from './events'
import Match from './match'
import PATTERNDATA from './malayalam.json'

export default class Mlhand {
  constructor (options) {
    this.canvasElement = options.canvas
    this.simplifiedCanvasElement = options.simplifiedCanvas
    this.events = new Events()
    this.pad = null
    this.simplePad = null
    this.init()
  }

  init () {
    this.pad = new Pad({
      canvas: this.canvasElement,
      events: this.events
    })

    this.pad.listen()

    this.simplePad = new Pad({
      canvas: this.simplifiedCanvasElement,
      events: this.events
    })

    this.events.subscribe('/draw/pen/down', this.onPenDown.bind(this))
    this.events.subscribe('/draw/pen/up', this.onPenUp.bind(this))
  }

  onPenDown (data) {
    this.simplePad.clear()
  }

  onPenUp (data) {
    let simplifiedPoints, box, translatedPoints
    log()
    simplifiedPoints = simplify(data.points, 50, 1)
    log('Simplifed ' + data.points.length + ' points to ' + simplifiedPoints.length + ' points.')
    this.pad.clear()
    this.simplePad.setPoints(simplifiedPoints)
    box = this.simplePad.getBoundingBox()
    translatedPoints = this.translate(simplifiedPoints, box)
    this.simplePad.setPoints(translatedPoints)
    log(JSON.stringify(translatedPoints))
    this.simplePad.draw()
    this.simplePad.drawBoundingBox()
    let match = new Match(PATTERNDATA)
    let result = match.run(translatedPoints)
    log(result)
    document.getElementById('result').innerHTML = result.pattern || ''
  };

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
