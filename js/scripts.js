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
        4, 1,
        19, 3,
        39, 5,
        59, 7,
        79, 9,
        99, 11,
        199, 13,
        399, 15,
        599, 17,
        999, 19
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

});



// }});
