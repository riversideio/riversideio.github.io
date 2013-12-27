var site = site || {};

// contents of main.js:
require.config({
    paths: {
    	jquery : '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
        switcher : './switcher',
        calendar : './calendar',
        moment : './moment',
        queryparse : './queryparse'
    }
});
var signupApp = 'https://riversideio-access.herokuapp.com';
// this is to startup the signup app
require( ['jquery'], function ( $ ) {
	$.ajax({
		url : signupApp + '/startup.json'
	})
} );


if ( '_testimonials' in window ) {
	require( [ 'jquery', 'switcher' ], function( $, Switcher ) { 
		var $testimonial = $('.testamonial:first'),
			$submit = $('.join-submit'),
			$input = $('[name="email"]'),
			switcher = new Switcher({
				data : _testimonials,
				$contents : $testimonial.find('p:first'),
				$name : $testimonial.find('strong'),
				$avatar : $testimonial.find('i')
			});
		site.testimonials = switcher;
		$submit.on('click', function( e ) {
			e.preventDefault();
			window.location = signupApp + "/?email=" + $input.val();

		})
	});
}

if ( '_events' in window ) {
	require([ 'jquery', 'moment', 'calendar' ], function ( $, moment, Calendar ) {
		var $el = $('.events'),
			$input = $('#event-search'),
			$msg = $('<li>').addClass('member-list-item'),
			_timer,
			calendar = new Calendar( { } );

		function handleKeyPress ( ) {
			clearTimeout( _timer );
			_timer = setTimeout( function ( ) {
				$el.html('').append( $msg.text('Loading') );
				var value = $input.val();
				calendar.searchFor( value, handleResponse );
			}, 500)
		}

		function handleResponse ( err, res ) {
			if ( err ) return console.warn( err );
			var entries = res.feed.entry;
			if( typeof entries === 'object' ){
				if ( entries.length ) {
					$el.html('');
					for( var i = 0; i < entries.length; i += 1 ) {
						var entry = entries[i];
						createEvent( entry );
					}
					return;
				}
			}
			$el.html('').append( $msg.text('No Results') );
		}

		function createEvent ( entry ) {
			var _$el = $('<li/>'),
				when = entry.gd$when[0],
				startTime = moment( when.startTime ).format('MMMM D YYYY h:mm a'),
				$header = $('<h2/>'),
				$link = $('<a/>').attr( 'href', entry.link[0].href )
					.text( entry.title.$t ),
				$date = $('<small/>').text( '- ' + startTime ),
				$content = $('<p/>').text( entry.content.$t );

			$header.append( $link );
			_$el.addClass('member-list-item').append([$header, $date, $content]);
			$el.append(_$el);
		}
		$el.html('').append( $msg.text('Loading') );
		calendar.getEvents( handleResponse );
		$input.on('keyup', handleKeyPress);

		site.calendar = calendar;
	});
}
