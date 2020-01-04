
export default {
  props: {
    sampleIndex: String,
    sample: Object
  },
  template: `<div class="z-depth-1 row">
    <canvas ref="pattern-sample-canvas" class="col s11" v-bind:height="options.canvasHeight" v-bind:width="options.canvasWidth">
    </canvas>
    <div v-if="editable" class="actions right">
        <button class="actions-remove btn waves-effect waves-light" @click="save( sampleIndex)"><i class="material-icons">save</i></button>
        <button class="actions-remove btn waves-effect waves-light" @click="undo( sampleIndex)"><i class="material-icons">undo</i></button>
        <button class="actions-remove btn waves-effect waves-light" @click="simpify( sampleIndex)"><i class="material-icons">timeline</i></button>
    </div>
  </div>`,
  data: () => ({ canvas: null,
    canvasContext: null,
    options: {
      canvasWidth: document.body.clientWidth * 0.9,
      canvasHeight: 500,
      showCoords: true,
      lineCap: 'round',
      lineWidth: 2,
      strokeStyle: '#009dec'
    },
    state: {
      isDown: false,
      timer: null,
      lastPos: null,
      stroke: [],
      strokes: []
    }
  }),
  computed: {
    editable: function () {
      return !this.sample.strokes || !this.sample.strokes.length
    }
  },
  mounted () {
    const canvasEl = this.$refs['pattern-sample-canvas']
    this.canvas = canvasEl
    this.canvasContext = canvasEl.getContext('2d')
    this.canvasContext.lineCap = this.options.lineCap
    this.canvasContext.lineWidth = this.options.lineWidth
    this.canvasContext.strokeStyle = this.options.strokeStyle

    this.canvasContext.clearRect(0, 0, canvasEl.width, canvasEl.height)
    this.canvasContext.beginPath()
    let strokes = this.sample.strokes
    if (this.editable) {
      this.listen(canvasEl)
    }

    for (let i = 0; i < strokes.length; i++) {
      this.drawStroke(strokes[i])
    }
    this.canvasContext.stroke()
  },
  methods: {
    drawStroke: function (stroke) {
      for (let i = 0; i < stroke.length; i++) {
        let p = stroke[i]
        if (i === 0) {
          this.canvasContext.moveTo(p.x, p.y)
        } else {
          this.canvasContext.lineTo(p.x, p.y)
        }
        if (this.options.showCoords) {
          this.canvasContext.fillStyle = 'blue'
          this.canvasContext.fillRect(p.x - 2, p.y - 2, 5, 5)
          this.canvasContext.fillText(`(${p.x}. ${p.y})`, p.x + 10, p.y + 10)
        }
      }
    },
    listen: function () {
      this.canvas.ontouchstart = this.canvas.onmousedown = (e) => { this.onmousedown(e) }
      this.canvas.ontouchmove = this.canvas.onmousemove = (e) => { this.onmousemove(e) }
      this.canvas.ontouchend = this.canvas.onmouseup = (e) => { this.onmouseup(e) }
    },
    onmousedown: function (e) {
      let pos = this._getXY(e)
      this.state.lastPos = pos
      this.state.stroke = []
      this.state.isDown = true
      this.state.stroke.push(pos)
      if (this.options.onPenDown) {
        this.options.onPenDown()

        if (this.state.timer) {
          clearTimeout(this.state.timer)
        }
      }
    },
    onmousemove: function (e) {
      if (!this.state.isDown) {
        return
      }
      let pos = this._getXY(e)
      this.state.stroke.push(pos)
      this.canvasContext.beginPath()
      this.canvasContext.moveTo(this.state.lastPos.x, this.state.lastPos.y)
      this.canvasContext.lineTo(pos.x, pos.y)
      this.canvasContext.stroke()
      this.state.lastPos = pos
    },
    onmouseup: function (e) {
      if (!this.state.isDown) {
        return
      }
      this.state.isDown = false
      const strokeData = {
        stroke: this.stroke
        //  box: this.getBoundingBox()
      }
      this.state.strokes.push(strokeData)
      if (this.options.onPenUp) {
        this.options.onPenUp(strokeData)
      }
      // if (data.box.x2 > this.canvas.width * 0.75) {
      //   this.state.timer = setTimeout(this.pushSegment.bind(this, this.data), this.TIMEOUT)
      // }
    },
    _getXY: function (event) {
      const canvasEl = this.$refs['pattern-sample-canvas']
      let rect = canvasEl.getBoundingClientRect()
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
    },
    getBoundingBox: function () {
      let minX = this.canvas.width
      let minY = this.canvas.height
      let maxX = 0
      let maxY = 0
      for (let i = 0; i < this.state.strokes.length; i++) {
        let p = this.state.strokes[i]
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
}
