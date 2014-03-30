define('map', ['jquery'], function( $ ) {

   var icon = {
    iconUrl : './img/map/marker.svg',
    iconSize : [ 64, 64 ],
    iconAnchor : [ 32, 64 ],
    popupAnchor : [ -3, -15 ],
    shadowUrl : './img/map/shadow.svg',
    shadowSize : [ 64, 64 ],
    shadowAnchor : [ 12, 60 ],
  };

  function eachFeature( feature, layer ) {
    if ( feature.properties && feature.properties.popupContent ) {
      layer.bindPopup( feature.properties.popupContent );
    }
  }

  function addMarker( feature, latLng ) {
    return L.marker(latLng, {
      icon : L.icon( icon )
    });
  }

  return function ( ) { 
    $.ajax({
      dataType : 'json',
      url : './location.geojson',
      success: function( res ){
        if ( typeof res !== 'object' || !('L' in window ) ) return;
        var location = res.geometry.coordinates;
        //L.mapbox.map('map', 'jacob2dot0.hlck268o');
        site.map = L.map('map', {
          dragging : false,
          touchZoom : false,
          scrollWheelZoom : false,
          doubleClickZoom: false,
          tap : false
        }).setView([location[1], location[0] -.003], 17);
        L.geoJson( res, {
          pointToLayer : addMarker,
          onEachFeature : eachFeature
        }).addTo( site.map )
        L.tileLayer('https://{s}.tiles.mapbox.com/v3/jacob2dot0.hlck268o/{z}/{x}/{y}.png', {
          attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
        }).addTo( site.map );
      }
    });
  }

});
