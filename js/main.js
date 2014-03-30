var site = site || {},
	apiUrl = 'https://victoria-club.herokuapp.com/api/v0/';

// contents of main.js:
require.config({
    paths: {
    	jquery : '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
        switcher : './switcher',
        calendar : './calendar',
        moment : './moment',
        queryparse : './queryparse',
        io : './sdk',
        map : './map'
    }
});
var signupApp = 'https://riversideio-access.herokuapp.com';
// this is to startup the signup app
require( ['jquery'], function ( $ ) {
	$.ajax({
		url : signupApp + '/a/startup.json'
	})
} );


if ( '_testimonials' in window ) {
	require( [ 'jquery', 'switcher', 'io', 'moment', 'map' ], function( $, Switcher, io, moment, map ) { 
		var $testimonial = $('.testimonial:first'),
			$submit = $('.join-submit'),
			$input = $('[name="email"]'),
			switcher = new Switcher({
				data : _testimonials,
				$contents : $testimonial.find('p:first'),
				$name : $testimonial.find('strong'),
				$avatar : $testimonial.find('i')
			});
    
		site.io = io;
		io.setUrl( apiUrl );
		site.testimonials = switcher;
		$submit.on('click', function( e ) {
			e.preventDefault();
			window.location = signupApp + "/?email=" + $input.val();
		});
		io.checkins.all({
			limit : 1,
			order : '-createdAt',
		},function( err, res){
			if ( err ) console.warn( err );
			if ( res.success ){
				var checkins = res.checkins.results,
					last = checkins[ checkins.length - 1 ],
					fromNow = moment( last.createdAt ).fromNow();
				$('.last-checkin').html( 'Last checkin ' + fromNow );
			}
		});
    map();
  });
}

if ( '_events' in window ) {
	require([ 'jquery', 'moment', 'calendar' ], function ( $, moment, Calendar ) {
		var $el = $('.events'),
		  calendar = new Calendar( { } );

		site.calendar = calendar;
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
				startTime = moment( when.startTime )
					.format('MMMM D YYYY h:mm a'),
				endTime = moment( when.endTime )
					.format('h:mm a'),
				$header = $('<h2/>'),
				$link = $('<a/>').attr( 'href', entry.link[0].href )
					.text( entry.title.$t ),
				$date = $('<small/>').text( '~ ' + 
					startTime + 
					' - ' + 
					endTime ),
				$content = $('<p/>').text( entry.content.$t );

			$header.append( $link );
			_$el.addClass('member-list-item').append([$header, $date, $content]);
			$el.append(_$el);
		}
		$el.html('').append( $msg.text('Loading') );
		calendar.getEvents( handleResponse );
		$input.on('keyup', handleKeyPress);

	});
}
