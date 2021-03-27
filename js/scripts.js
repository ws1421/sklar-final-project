mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A';

// function to translate NYC land use codes into a color and a description
// var LandUseLookup = (code) => {
//   switch (code) {
//     case 1:
//       return {
//         color: '#f4f455',
//         description: '1 & 2 Family',
//       };
//     case 2:
//       return {
//         color: '#f7d496',
//         description: 'Multifamily Walk-up',
//       };
//     case 3:
//       return {
//         color: '#FF9900',
//         description: 'Multifamily Elevator',
//       };
//     case 4:
//       return {
//         color: '#f7cabf',
//         description: 'Mixed Res. & Commercial',
//       };
//     case 5:
//       return {
//         color: '#ea6661',
//         description: 'Commercial & Office',
//       };
//     case 6:
//       return {
//         color: '#d36ff4',
//         description: 'Industrial & Manufacturing',
//       };
//     case 7:
//       return {
//         color: '#dac0e8',
//         description: 'Transportation & Utility',
//       };
//     case 8:
//       return {
//         color: '#5CA2D1',
//         description: 'Public Facilities & Institutions',
//       };
//     case 9:
//       return {
//         color: '#8ece7c',
//         description: 'Open Space & Outdoor Recreation',
//       };
//     case 10:
//       return {
//         color: '#bab8b6',
//         description: 'Parking Facilities',
//       };
//     case 11:
//       return {
//         color: '#5f5f60',
//         description: 'Vacant Land',
//       };
//     case 12:
//       return {
//         color: '#5f5f60',
//         description: 'Other',
//       };
//     default:
//       return {
//         color: '#5f5f60',
//         description: 'Other',
//       };
//   }
// };

var map = new mapboxgl.Map({
  container: 'mapContainer', // container ID
  style: 'mapbox://styles/mapbox/dark-v10', // style URL
  center: [-73.917,40.756], // starting position [lng, lat]
  zoom: 12 // starting zoom
});

// add navigation
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
    'layout': {},
    'paint': {
      'circle-radius': [
        'interpolate', ['linear'],
        ['get', 'entries']

      ]





  // add an empty data source, which we will use to highlight the lot the user is hovering over
  map.addSource('highlight-feature', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  })

  // add a layer for the highlighted lot
  map.addLayer({
    id: 'highlight-line',
    type: 'line',
    source: 'highlight-feature',
    paint: {
      'line-width': 2,
      'line-opacity': 0.9,
      'line-color': 'white',
    }
  });
})

// Create a popup, but don't add it to the map yet.
var popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
});

map.on('mousemove', function (e) {
  // query for the features under the mouse, but only in the lots layer
  var features = map.queryRenderedFeatures(e.point, {
      layers: ['old-astoria-fill'],
  });

  if (features.length > 0) {
    // show the popup
    // Populate the popup and set its coordinates
    // based on the feature found.

    var hoveredFeature = features[0]
    var address = hoveredFeature.properties.address
    var landuseDescription = LandUseLookup(parseInt(hoveredFeature.properties.landuse)).description

    var popupContent = `
      <div>
        ${address}<br/>
        ${landuseDescription}
      </div>
    `

    popup.setLngLat(e.lngLat).setHTML(popupContent).addTo(map);

    // set this lot's polygon feature as the data for the highlight source
    map.getSource('highlight-feature').setData(hoveredFeature.geometry);

    // show the cursor as a pointer
    map.getCanvas().style.cursor = 'pointer';
  } else {
    // remove the Popup
    popup.remove();

    map.getCanvas().style.cursor = '';
  }

})
