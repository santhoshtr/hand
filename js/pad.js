define( function () {
	'use strict';

	function Pad( options ) {
		this.canvas = options.canvas;
		this.events = options.events;
		this.canvasContext = this.canvas.getContext( '2d' );
		this.points = [];
	}

	Pad.prototype.setPenStyle = function () {
		this.canvasContext.lineCap = 'round';
		this.canvasContext.lineWidth = 2;
		this.canvasContext.strokeStyle = 'steelblue';
	};

	Pad.prototype.clear = function () {
		this.canvasContext.clearRect( 0, 0, this.canvas.width, this.canvas.height );
	};

	Pad.prototype.draw = function () {
		var i, p, canvas, ctx;
		this.setPenStyle();
		this.canvasContext.beginPath();
		for ( i = 0; i < this.points.length; i++ ) {
			p = this.points[ i ];
			if ( i === 0 ) {
				this.canvasContext.moveTo( p.x, p.y );
			} else {
				this.canvasContext.lineTo( p.x, p.y );
			}
		}
		this.canvasContext.stroke();
	};

	Pad.prototype.listen = function () {
		var isDown = false,
			self = this,
			last;


		this.canvas.onmousedown = function ( e ) {
			var pos = getXY( e );
			last = pos;
			self.points = [];
			isDown = true;
			self.points.push( pos );
			self.setPenStyle();
			self.events.publish( '/draw/pen/down' );
		};

		this.canvas.onmousemove = function ( e ) {
			if ( !isDown ) return;
			var pos = getXY( e );
			self.points.push( pos );
			self.canvasContext.beginPath();
			self.canvasContext.moveTo( last.x, last.y );
			self.canvasContext.lineTo( pos.x, pos.y );
			self.canvasContext.stroke();
			last = pos;
		};
		this.canvas.onmouseup = function ( e ) {
			if ( !isDown ) return;
			isDown = false;
			self.events.publish( '/draw/pen/up', {
				points: self.points
			} );
		};

		this.canvas.ontouchstart = this.canvas.onmousedown;
		this.canvas.ontouchmove = this.canvas.onmousemove;
		this.canvas.ontouchend = this.canvas.onmouseup;

		function getXY( e ) {
			var rect = self.canvas.getBoundingClientRect();
			if ( e.type.indexOf( 'touch' ) >=0 ) {
				return {
					x: e.targetTouches[ 0 ].clientX - rect.left,
					y: e.targetTouches[ 0 ].clientY - rect.top
				};
			} else {
				return {
					x: e.clientX - rect.left,
					y: e.clientY - rect.top
				};
			}
		}
	};

	Pad.prototype.setPoints = function ( points ) {
		this.points = points;
	};

	Pad.prototype.getBoundingBox = function () {
		var minX = this.canvas.width,
			minY = this.canvas.height,
			maxX = 0,
			maxY = 0,
			i = 0,
			p;
		for ( i = 0; i < this.points.length; i++ ) {
			p = this.points[ i ];
			if ( p.x <= minX ) minX = p.x;
			if ( p.y <= minY ) minY = p.y;
			if ( p.x >= maxX ) maxX = p.x;
			if ( p.y >= maxY ) maxY = p.y;
		}
		return {
			x1: minX,
			y1: minY,
			x2: maxX,
			y2: maxY
		};
	};

	Pad.prototype.drawBoundingBox = function () {
		var box = this.getBoundingBox();
		this.canvasContext.lineWidth = 2;
		this.canvasContext.strokeStyle = '#cc0';
		this.canvasContext.strokeRect( box.x1, box.y1, box.x2, box.y2 );
		this.canvasContext.lineWidth = this.canvasContext.lineWidth;
	};

	return Pad;
} );
