mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A';

// load mapbox gl basemap
var map = new mapboxgl.Map({
  container: 'mapContainer', // container ID
  style: 'mapbox://styles/mapbox/dark-v10', // style URL
  center: [-73.917, 40.76], // starting position [lng, lat]
  zoom: 13 // starting zoom
});

// add navigation control
map.addControl(new mapboxgl.NavigationControl({}));

// open the modal
$(window).on('load', function() {
  $('#welcomeModal').modal('show');
});


$('#aboutButton').on('click', function() {
  $('#welcomeModal').modal('show');
});


// add geojson buildings data
map.on('style.load', function() {
  map.addSource('buildings', {
    type: 'geojson',
    data: 'data/dob-truncated.geojson'
  });

  // create data-driven circle features sized to number of net residential units
  map.addLayer({
    'id': 'buildings-layer',
    'type': 'circle',
    'source': 'buildings',
    'paint': {
      'circle-radius': [
        'interpolate', [
          'linear'
        ],
        ['get', 'ClassANet'],
        4, 5,
        19, 8,
        39, 11,
        59, 14,
        79, 17,
        99, 20,
        199, 23,
        399, 26,
        599, 29,
        999, 32
      ],
// color circles based on under construction or completed
      'circle-color': [
        'match',
        ['get', 'Job_Status'],
        '3. Permitted for Construction', '#fafa16',
        '5. Completed Construction', '#1af00e',
        /* other */ '#ccc'
      ],
      'circle-opacity': 0.5
    }


  });

  // Create a popup, but don't add it to the map yet.
var popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
});

map.on('mousemove', function (e) {
  // query for the features under the mouse, but only in the buildings layer
  var features = map.queryRenderedFeatures(e.point, {
      layers: ['buildings-layer'],
  });

  if (features.length > 0) {
     // show the popup
     // Populate the popup and set its coordinates
     // based on the feature found.

     var hoveredFeature = features[0]
     var address = hoveredFeature.properties.AddressNum
     var street = hoveredFeature.properties.AddressSt
     var floors = hoveredFeature.properties.FloorsProp
     var units = hoveredFeature.properties.ClassANet
     var yearComplete = hoveredFeature.properties.CompltYear
     var yearPermit = hoveredFeature.properties.PermitYear

     var popupContent = `
       <div>
         ${address} ${street}<br/>
         ${floors} Stories<br/>
         ${units} New Units<br/>
         Permitted ${yearPermit}<br/>
         Completed ${yearComplete}
       </div>
     `

     popup.setLngLat(e.lngLat).setHTML(popupContent).addTo(map);

     map.getCanvas().style.cursor = 'pointer';
 } else {
   // remove the Popup
   popup.remove();

   map.getCanvas().style.cursor = '';
 }


});

});
