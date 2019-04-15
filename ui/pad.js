
// eslint-disable-next-line no-unused-vars
class WritingPad {
  constructor (options) {
    this.canvas = options.canvas
    let strokeOptions = options.strokeOptions || {
      lineCap: 'round',
      lineWidth: 4,
      strokeStyle: '#4169E1' // Royal Blue color.
    }
    this.options = options
    this.canvasContext = this.canvas.getContext('2d')
    this.points = []
    this.data = []
    this.lastPos = null
    this.previousPad = null
    this.isDown = false
    this.timer = null
    this.segments = []
    this.TIMEOUT = 1500
    this.setPenStyle(strokeOptions)
    this.listen()
  }

  setPenStyle (strokeOptions) {
    this.canvasContext.lineCap = strokeOptions.lineCap
    this.canvasContext.lineWidth = strokeOptions.lineWidth
    this.canvasContext.strokeStyle = strokeOptions.strokeStyle
  }

  clear () {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.data = []
  }

  pushSegment (segmentData) {
    this.segments.push(segmentData)
    if (!this.previousPad) {
      this.previousPad = new WritingPad({
        canvas: this.createPreviousCanvas()
      })
    }

    this.clear()
    this.previousPad.clear()
    this.previousPad.setData(segmentData)
    this.previousPad.draw()
    this.previousPad.canvas.style.left = `${-1 * this.canvas.width * 0.9}px`
  }

  createPreviousCanvas () {
    let prevCanvas = this.canvas.cloneNode(true)
    if (!prevCanvas.classList) {
      prevCanvas.className = 'inactive'
    } else {
      prevCanvas.classList.add('inactive')
    }
    this.canvas.insertAdjacentElement('afterend', prevCanvas)
    return prevCanvas
  }

  /**
   * Show previous pad, and hide after double timeout
   */
  previous () {
    this.previousPad.canvas.style.left = `${0}px`
    this.timer = setTimeout(this.pushSegment.bind(this, this.segments.pop()), this.TIMEOUT * 2)
  }

  draw () {
    this.canvasContext.beginPath()
    for (let i = 0; i < this.data.length; i++) {
      let points = this.data[i].points || this.data[i]
      for (let j = 0; j < points.length; j++) {
        let p = points[j]
        if (j === 0) {
          this.canvasContext.moveTo(p.x, p.y)
        } else {
          this.canvasContext.lineTo(p.x, p.y)
        }
      }
    }
    this.canvasContext.stroke()
  }

  listen () {
    this.canvas.ontouchstart = this.canvas.onmousedown = (e) => { this.onmousedown(e) }
    this.canvas.ontouchmove = this.canvas.onmousemove = (e) => { this.onmousemove(e) }
    this.canvas.ontouchend = this.canvas.onmouseup = (e) => { this.onmouseup(e) }
  }

  onmousedown (e) {
    let pos = this._getXY(e)
    this.lastPos = pos
    this.points = []
    this.isDown = true
    this.points.push(pos)
    if (this.options.onPenDown) {
      this.options.onPenDown()

      if (this.timer) {
        clearTimeout(this.timer)
      }
    }
  }

  onmousemove (e) {
    if (!this.isDown) {
      return
    }
    let pos = this._getXY(e)
    this.points.push(pos)
    this.canvasContext.beginPath()
    this.canvasContext.moveTo(this.lastPos.x, this.lastPos.y)
    this.canvasContext.lineTo(pos.x, pos.y)
    this.canvasContext.stroke()
    this.lastPos = pos
  }

  onmouseup (e) {
    if (!this.isDown) {
      return
    }
    this.isDown = false
    const data = {
      points: this.points,
      box: this.getBoundingBox()
    }
    this.data.push(data)
    this.options.onPenUp(data)
    if (data.box.x2 > this.canvas.width * 0.75) {
      this.timer = setTimeout(this.pushSegment.bind(this, this.data), this.TIMEOUT)
    }
  }

  setData (data) {
    this.data = data
  }

  _getXY (event) {
    let rect = this.canvas.getBoundingClientRect()
    if (event.type.indexOf('touch') >= 0) {
      return {
        x: event.targetTouches[0].clientX - rect.left,
        y: event.targetTouches[0].clientY - rect.top
      }
    } else {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      }
    }
  }

  getBoundingBox () {
    let minX = this.canvas.width
    let minY = this.canvas.height
    let maxX = 0
    let maxY = 0
    for (let i = 0; i < this.points.length; i++) {
      let p = this.points[i]
      if (p.x <= minX) {
        minX = p.x
      }
      if (p.y <= minY) {
        minY = p.y
      }
      if (p.x >= maxX) {
        maxX = p.x
      }
      if (p.y >= maxY) {
        maxY = p.y
      }
    }
    return {
      x1: minX,
      y1: minY,
      x2: maxX,
      y2: maxY
    }
  }
}
