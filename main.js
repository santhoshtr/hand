// main entry point
define( [ './js/pad', './js/simplify', './js/events', './js/log', './js/match' ], function ( Pad, simplify, Events, log, Match ) {
	'use strict';

	require.config( {
		paths: {
			json: 'lib/text',
		}
	} );
	var events, pad, simplePad, $console;

	events = new Events();
	pad = new Pad( {
		canvas: document.getElementById( 'pad' ),
		events: events
	} );

	pad.listen();

	simplePad = new Pad( {
		canvas: document.getElementById( 'simplified' ),
		events: events
	} );

	function translate( points, box ) {
		var i, p, translatedPoints = [];

		for ( i = 0; i < points.length; i++ ) {
			p = points[ i ];
			translatedPoints.push( {
				x: p.x - box.x1,
				y: p.y - box.y1,
			} );
		}
		return translatedPoints;
	}

	events.subscribe( '/draw/pen/down', function ( data ) {
		simplePad.clear();
	} );

	events.subscribe( '/draw/pen/up', function ( data ) {
		var match, simplifiedPoints, i, p, box, translatedPoints;
		log();
		simplifiedPoints = simplify( data.points, 50, 1 );
		log( 'Simplifed ' + data.points.length + ' points to ' + simplifiedPoints.length + ' points.' );
		pad.clear();
		simplePad.setPoints( simplifiedPoints );
		box = simplePad.getBoundingBox();
		translatedPoints = translate( simplifiedPoints, box );
		simplePad.setPoints( translatedPoints );
		log( JSON.stringify( translatedPoints ) );
		simplePad.draw();
		simplePad.drawBoundingBox();
		require( [ 'json!data/malayalam.json' ], function ( data ) {
			var result;
			match = new Match( JSON.parse( data ) );
			result = match.run( translatedPoints );
			log( result );

			document.getElementById( 'result' ).innerHTML = result.pattern || '';
		} );
	} );


} );
