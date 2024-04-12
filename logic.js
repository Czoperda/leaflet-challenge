// Leaflet map
var map = L.map('map').setView([0, 0], 2);

// OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18
}).addTo(map);

// Data from USGS API
// Using Past Day - All Earthquakes
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
  .then(response => response.json())
  .then(data => {
    // Iterate over each earthquake data point
    data.features.forEach(earthquake => {
      const magnitude = earthquake.properties.mag;
      const depth = earthquake.geometry.coordinates[2];
      const place = earthquake.properties.place;
      const [lat, lng] = earthquake.geometry.coordinates;

      // Calculate magnitude
      const markerSize = magnitude * 3.5;

      // Calculate depth
      let markerColor;
      if (depth < 10) {
        markerColor = 'green';
      } else if (depth < 30) {
        markerColor = 'lightgreen';
      } else if (depth < 50) {
        markerColor = 'yellow';
      } else if (depth < 70) {
        markerColor = 'orange';
      } else if (depth < 90) {
        markerColor = 'orangered';
      } else {
        markerColor = 'red';
      }

      // Create circle marker for earthquake epicenter
      const marker = L.circleMarker([lat, lng], {
        radius: markerSize,
        fillColor: markerColor,
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);

      // Create tooltip content with location, magnitude, and depth
      const tooltipContent = `Location: ${place}<br>Magnitude: ${magnitude}<br>Depth: ${depth} km`;

      // Bind tooltip to marker
      marker.bindTooltip(tooltipContent);
    });
  })
  .catch(error => {
    console.error('Error fetching earthquake data:', error);
  });

// Legend
var depthLegend = L.control({position: 'bottomright'});

depthLegend.onAdd = function () {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML += '<h4>Depth Legend</h4>';
  div.innerHTML += '<i style="background: green"></i> -10 - 10 km<br>';
  div.innerHTML += '<i style="background: lightgreen"></i> 10 - 30 km<br>';
  div.innerHTML += '<i style="background: yellow"></i> 30 - 50 km<br>';
  div.innerHTML += '<i style="background: orange"></i> 50 - 70 km<br>';
  div.innerHTML += '<i style="background: orangered"></i> 70 - 90 km<br>';
  div.innerHTML += '<i style="background: red"></i> 90+ km<br>';
  return div;
};

depthLegend.addTo(map);
