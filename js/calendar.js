define("calendar", [ 'jquery', 'moment' ], function ( $, moment ) {

	//http://www.google.com/calendar/feeds/{cid}/public/full?alt=json&singleevents=true&sortorder={sortorder}&start-min={startdate}&start-max=2013-12-25T23:59:59

	function Calendar ( options ) {
		options = options || {};
		this.max = options.max || '15';
		this.cid = options.cid || '04vr7pj9ccnnkudbr7lust24h4@group.calendar.google.com';
		this.sortorder = options.sortorder || 'ascending'
		this.date = new Date( );
	}

	Calendar.prototype.upcomingEvents = function ( callback ) {
		// format date
		date = moment();
		var starttime = date.format(),
			endTime = moment().add('M', 1).format(),
			data = {
				alt : 'json-in-script',
				singleevents : true,
				sortorder : this.sortorder,
				timeMax : starttime,
				timeMin : endTime,
				orderby : 'starttime',
				futureevents : true,
				maxResults : 20
			},
			url = 'http://www.google.com/calendar/feeds/' + 
				this.cid + 
				'/public/full';

		if ( this.search ) data.q = this.search;

		this.fetchEvents( url, data, callback );
	};

	Calendar.prototype.searchFor = function ( query, callback ) {
		this.search = query.length ? query : null;
		this.upcomingEvents( callback );
	};

	Calendar.prototype.fetchEvents = function ( url, data, callback ) {

		$.ajax({
			url : url,
			type : 'GET',
			data : data,
			dataType : 'jsonp',
			processDate : true,
			success : function ( res ) {
				callback( null, res );
			},
			error : function ( err ) {
				callback( err );
			}
		})

	};

	return Calendar;
});