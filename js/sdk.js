(function ( exports ) {

    function ioSdk( $ ) {

        var user,
            processing,
            delimiterStart = '{{',
            delimiterEnd = '}}',
            pattern = new RegExp( delimiterStart + '(.+?)' + delimiterEnd, 'g');

        function templating ( str, vars ) {
            function getVars ( item ) {
                // this is kinda cray
                // replace delimiters and grab var
                return vars[ item.replace(delimiterStart, '')
                    .replace(delimiterEnd, '') ];
            }
            var items = str.match( pattern ),
                values = items.map( getVars );

            for( var i = 0; i < items.length; i += 1 ) {
                str = str.replace( items[i], values[i] );
            }
            return str;
        }

        function _sendRequest ( endpoint, data, callback, options ) {

            if ( user ) {
                data = data || {};
                data.session_token = user.session_token;
            }

            return $.ajax({
                // abstract url to allow for better dev
                url : 'https://victoria-club.herokuapp.com/api/v0/' + endpoint,
                data : data,
                type : options.method || "post",
                success : function ( res ) {
                    if ( callback ) {
                        if ( res.success ) {
                            callback( null, res );
                            if ( 
                                /\/sessions.json$/g.test( this.url ) ||
                                ( 
                                    /\/users.json$/g.test( this.url ) && 
                                    this.type === "POST" 
                                )
                            ){
                                user = res.user;
                            }
                        }else{
                            callback( res );
                        }
                    }
                },
                error : function ( err ) {
                    if ( callback ) callback ( err );
                }
            })
        }

        function _setCall ( endpoint, options ) {
            options = options || {};
            return function ( values, callback ) {

                var _endpoint;

                if ( user ) {
                    values.id = values.id || user.id;
                }

                if ( typeof values === 'function' ) {
                    callback = values;
                    values = {};
                }

                _endpoint = options.endpointVars ? 
                    templating( endpoint, values ) :
                    endpoint;

                if ( !processing ) {
                    processing = true;
                    return _sendRequest( _endpoint, values, function ( ) {
                        processing = false;
                        if ( callback ) callback.apply( null, arguments );
                    }, options || {} );
                }
            }
        }

        return {
            users : {
                login : _setCall('sessions.json'),
                create : _setCall('users.json'),
                all : _setCall('users.json', {
                  method : 'get'
                }),
                read : _setCall('users.json', { 
                    method : 'get' 
                }),
                update : _setCall('users/{{id}}/update.json', {
                    endpointVars : true
                }),
                show : _setCall('users/{{id}}/show.json', {
                    endpointVars : true,
                    method : 'get'
                }),
                updateCard : _setCall('users/{{id}}/update_card.json', {
                    endpointVars : true
                }),
                checkin : _setCall('checkins.json'),
                resetPassword : _setCall('users/reset_password.json'),
                cancelPlan : _setCall('users/{{id}}/cancel_plan.json', {
                    endpointVars : true
                }),
                updatePlan : _setCall('users/{{id}}/update_plan.json', {
                    endpointVars : true
                }),
                charge : _setCall('users/{{id}}/charge.json', {
                    endpointVars : true
                })
            },
            plans : {
                all : _setCall('plans.json', {
                    method : 'get'
                })
            },
            checkins : {
                all : _setCall('checkins.json', {
                    method : 'get'
                }),
                create : _setCall('checkins.json')
            }

        }

    }
    if ( typeof define === 'function' ) {
        return define( 'io', ['jquery'], ioSdk )
    }
    // globals
    exports.io = ioSdk( jQuery );

}( this ))