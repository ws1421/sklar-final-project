mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A';

var map = new mapboxgl.Map({
  container: 'mapContainer', // container ID
  style: 'mapbox://styles/mapbox/dark-v10', // style URL
  center: [-73.917,40.756], // starting position [lng, lat]
  zoom: 12 // starting zoom
});

// add navigation control
map.addControl(new mapboxgl.NavigationControl({
}));

map.on('style.load', function () {
  // add a geojson source
  map.addSource('buildings', {
    type: 'geojson',
    data: 'data/dob-truncated.geojson'
  });

  // add a layer to style and display the source
  map.addLayer({
    'id': 'buildings-layer',
    'type': 'circle',
    'source': 'buildings',

      
    });

});



// }});
