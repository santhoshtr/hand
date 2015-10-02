define( function () {
	'use strict';
	var $console = document.getElementById( 'console' );

	return function ( content ) {
		var logStr;

		if ( content === undefined ) {
			$console.innerHTML = '';
			return;
		}
		if ( typeof content === 'object' ) {
			logStr = JSON.stringify( content );
		} else {
			logStr = content;
		}
		$console.innerHTML = $console.innerHTML + '<br>' + logStr;
	};
} );
