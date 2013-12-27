define( 'queryparse', ['moment'], function( moment ) {

	/*
		
		Query Parser
		---------------------------
		This helps parse out queries and helps to have advanced queries
		using things like... date:1/2/14 to find a event on that date


	*/

	function splitWords ( query ) {
		return query.split( / / );
	}

	function _methodParse ( words ) {
		var methods = {},
			remove = [],
			pattern = /:/;
		for ( var i = 0; i < words.length; i += 1) {
			var word = words[i];
			if ( pattern.test( word ) ) {
				var values = word.split( pattern );
				methods[ values[ 0 ] ] = values[ 1 ];
				remove.push( words[ i ] );
			}
		}

		return {
			remove : remove,
			methods : methods
		};
	}

	function parse ( query ) {
		var words = splitWords( query ),
			_methods =  _methodParse( words );

		for( var q = 0; q < _methods.remove.length; q += 1 ) {
			query = query.replace( _methods.remove[ q ], '' );
		}

		return {
			query : query,
			methods : _methods.methods
		}
	}

	return parse;

});