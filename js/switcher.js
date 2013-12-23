define("switcher", function ( ) {
	function Switcher ( options ) {
		options = options || {};
		this.$contents = options.$contents;
		this.$name = options.$name;
		this.$avatar = options.$avatar;
		this.data = options.data;
		this.length = this.data.length;
		this.delay = options.delay || 8000;

		this.startTimer( this.delay );
		this.switchTo( 0 );
	}

	Switcher.prototype.switchTo = function ( num ) {
		var data = this.data[ num ];
		this.current = +num;
		this.$avatar.css( "background-image",  "url(" + data.avatar + ")" );
		this.$contents.html( data.contents.substring(0, 130) + 
			'... <a href="./testimonials.html#'+ encodeURIComponent(data.name) + 
			'">Read More</a>' );
		this.$name.html( '~ ' + data.name );
	};

	Switcher.prototype.startTimer = function ( ms ) {
		var _this = this;
		clearTimeout( this._timer );
		this._timer = setTimeout( function(){
			_this.next( );
		}, ms )

	};

	Switcher.prototype.next = function ( ) {
		var index = this.current + 1 === this.length ? 
			0 : this.current + 1;
		this.switchTo( index );
		this.startTimer( this.delay ); 
	};

	return Switcher;
});