// main entry point
define( [ './levenshteinDistance', './log' ], function ( levenshteinDistance, log ) {
	'use strict';

	function Match( data ) {
		this.data = data;
		this.threshold = 0.8;
	}

	Match.prototype.run = function ( stroke ) {
		var i, keys, score, result = {
				score: 0
			},
			pattern;

		keys = Object.keys( this.data );
		for ( i = 0; i < keys.length; i++ ) {
			log( 'Matching ' + keys[ i ] );
			score = this.match( stroke, this.data[ keys[ i ] ].points );
			if ( score >= this.threshold && score >= result.score ) {
				pattern = keys[ i ];
				result = {
					pattern: pattern,
					score: score
				};
				if ( score === 1 ) {
					break;
				}
			}
			pattern = undefined;
		}
		return result;
	};

	Match.prototype.match = function ( path, candidatePath ) {
		var i, j, p1, p2, distance, penalty = 0,
			ld,
			self = this,
			lengthDiff;

		ld = levenshteinDistance( path, candidatePath, function ( a, b ) {
			return self.distance( a, b ) <= 100;
		} );

		log( 'levenshteinDistance: ' + ld );
		if ( ld < path.length / 3 ) {
			return 1 - ( ld / path.length );
		}
		if ( path.length !== candidatePath.length ) {
			lengthDiff = candidatePath.length - path.length;
			penalty += 0.1 * Math.abs( lengthDiff );
		}

		if ( penalty > this.threshold / 2 ) {
			// Early return
			return 1 - penalty;
		}

		for ( i = 0; i < path.length; i++ ) {
			p1 = path[ i ];
			p2 = candidatePath[ i ] || p2; // Previous p2
			distance = this.distance( p1, p2 );
			log( ' >> ' + JSON.stringify( p1 ) + ' & ' + JSON.stringify( p2 ) + ': distance = ' + distance );
			penalty += 0.001 * distance;
		}

		return 1 - penalty;
	};

	Match.prototype.distance = function ( p1, p2 ) {
		var dx = p1.x - p2.x,
			dy = p1.y - p2.y;
		return parseInt( Math.sqrt( dx * dx + dy * dy ), 10 );
	};

	return Match;
} );
