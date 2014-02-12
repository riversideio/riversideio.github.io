define("calendar", [ 'jquery', 'moment', 'queryparse', 'io' ], function ( $, moment, qp, io ) {

	//http://www.google.com/calendar/feeds/{cid}/public/full?alt=json&singleevents=true&sortorder={sortorder}&start-min={startdate}&start-max=2013-12-25T23:59:59

	function Calendar ( options ) {
		options = options || {};
		this.max = options.max || '15';
		this.cid = options.cid || '04vr7pj9ccnnkudbr7lust24h4@group.calendar.google.com';
		this.sortorder = options.sortorder || 'ascending'
		this.date = new Date( );
	}

	Calendar.prototype.getEvents = function ( callback ) {
		// format date
		date = moment();
		var startTime = this.fromDate ?
				this.fromDate.format() :
				this.inputDate ?
					this.inputDate.format() :
					date.format(),
			endTime = this.toDate ?
				this.toDate.format() :
				this.fromDate ?
					this.fromDate.add( 'M', 1 ).format( ) :
					this.inputDate ?
						this.inputDate.add( 'd', 1 ).format() : 
						moment().add( 'M', 1 ).format(),
			data = {
				singleEvents : true,
				timeMax : endTime,
				timeMin : startTime,
				orderBy : 'startTime'
			};

		if ( this.search ) data.q = this.search;

		this.fetchEvents( data, callback );
	};

	Calendar.prototype.searchFor = function ( query, callback ) {
		var _query = qp( query );
		query = _query.query;

		this.inputDate = null;
		for ( var key in _query.methods ){
			this._methods( key, _query.methods[ key ] );
		}
		this.search = query.length ? query : null;
		this.getEvents( callback );
	};

	Calendar.prototype._methods = function ( key, value ) {
		var _this = this;
		var methods = {
			"date" : function ( date ) {
				var _date = moment( date );
				if ( _date.isValid() ) {
					_this.inputDate = _date;
				}
				return 
			},
			"from" : function ( date ) {
				var _date = moment( date );
				if ( _date.isValid() ) {
					_this.fromDate = _date;
				}
				return 
			},
			"to" : function ( date ) {
				var _date = moment( date );
				if ( _date.isValid() ) {
					_this.toDate = _date;
				}
				return 
			}

		}
		if ( methods[ key ] ) return methods[ key ]( value );
	};

	Calendar.prototype.fetchEvents = function ( data, callback ) {
		io.events.all( data, callback );
	};

	return Calendar;
});