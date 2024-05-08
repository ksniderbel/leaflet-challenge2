// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// let earthquake_data = L.LayerGroup()
// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  console.log(data)
  console.log(data.features)
  GetCoordinates(data.features)
});
// Function to read thru each earthquake occured
function GetCoordinates(earthquakeData) {
  
    // function onEachFeature(feature,layer){
  
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>depth: ${feature.geometry.coordinates[2]}</p>`);
      }
      //colorScale = chroma.scale(['yellow', 'red']).mode('lch').colors(6);
      colorScale = chroma.scale(['Green','Yellow' ,'Red']).domain([0, 50]);
      // Create a GeoJSON layer that contains the features array on the earthquakeData object.
      // Run the onEachFeature function once for each piece of data in the array.
     earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature,latlng){ 
           
            return  L.circle(latlng,{radius: feature.properties.mag * 10000 , // circle size on magnitude     
                   fillColor: colorScale(feature.geometry.coordinates[2]*10).hex(), // depth for the colorscale
                   color: 'black',
                   opacity: 0.2,
                   fillOpacity: 0.75 
        })},
           
                
    })
    createMap(earthquakes);
}
function createMap(earthquakes) {
    let southWest = L.latLng(40.712, -74.227); // Define the southwest corner of the bounds
    let northEast = L.latLng(40.774, -74.125); // Define the northeast corner of the bounds
    let bounds = L.latLngBounds(southWest, northEast); // Create a LatLngBounds object
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    
    // Create a baseMaps object.
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };
    
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
        Earthquakes: earthquakes
    };
    let myMap = L.map("map", {
        center: [
          37.09, -95.71
        ],
        zoom: 5,
        layers: [street, earthquakes]
      });
      // Create a layer control.
      // Pass it our baseMaps and overlayMaps.
      // Add the layer control to the map.
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
    //Add the legend and its  to the map. 
    let legend = L.control({ position: "bottomright" });
    
    
    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend');
        let magnitudes = [-10, 10, 20, 30, 40, 50];
        let labels = ['<strong>Depth</strong>'];
        let color = "yellow";
        for (let i = 0; i < magnitudes.length; i++) {
            labels.push(
                '<i style="background:' + colorScale(magnitudes[i] + 1).hex() + '"></i> ' +
                magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] : '+'));               
               
            }
            
            div.innerHTML = labels.join('<br>');
            return div;
        };
        legend.addTo(myMap);   
    }


