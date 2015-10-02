//http://davidwalsh.name/pubsub-javascript
define( function () {
	'use strict';

	function Events() {
		this.topics = {};
	}

	Events.prototype.subscribe = function ( topic, listener ) {
		var self = this;
		// Create the topic's object if not yet created
		if ( !this.topics.hasOwnProperty.call( this.topics, topic ) ) this.topics[ topic ] = [];
		// Add the listener to queue
		var index = this.topics[ topic ].push( listener ) - 1;
		// Provide handle back for removal of topic
		return {
			remove: function () {
				delete self.topics[ topic ][ index ];
			}
		};
	};

	Events.prototype.publish = function ( topic, info ) {
		// If the topic doesn't exist, or there's no listeners in queue, just leave
		if ( !this.topics.hasOwnProperty.call( this.topics, topic ) ) return;
		// Cycle through topics queue, fire!
		this.topics[ topic ].forEach( function ( item ) {
			item( info !== undefined ? info : {} );
		} );
	};
	return Events;
} );
