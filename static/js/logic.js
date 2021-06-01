// json file from USGS...
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Tetonicplates JSON file from github...
var githubJson = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"


// Perform a GET request to the query URL
d3.json(url, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createMarkers(data.features);
});  

// create a function to create markers and popups
function createMarkers(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake

    function onEachFeature(feature, layer) {

        // date formatter for popup
        var format = d3.timeFormat("%d-%b-%Y at %H:%M");

        layer.bindPopup(`<strong>Place: </strong> ${feature.properties.place}<br><strong>Time: </strong>${format(new Date(feature.properties.time))}<br><strong>depth: </strong>${feature.properties.mag}<br><strong>Depth: </strong>${feature.geometry.coordinates[2]}`);
    };

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    var earthquakes = L.geoJSON(earthquakeData, {

        // use pointToLayer to create circle markers for each data's coordinates
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: depthColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 0.3,
                opacity: 0.5,
                fillOpacity: 1
            });
        },
        // Run the onEachFeature function once for each piece of data in the array
        onEachFeature: onEachFeature
    });

    // get tectonic plates data from geojson url
    d3.json(githubJson, function(response) {

        var tecFeatures = response.features;

        var plateData = L.geoJSON(tecFeatures, {
            color: "red"
        });

        // Sending our earthquakes and plateData layer to the createMap function
        createMap(earthquakes, plateData);    
    });
    
    
}; // close createMarker function


function createMap(earthquakes, faultlines)
{
    
    
    // Add a tile layer (the background map image) to our map
    // We use the addTo method to add objects to our map

    
    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
    });

    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
    });

    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });

    
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
    "Dark Map": darkmap,
    "Light Map": lightmap,
    "Street Map": streetmap,
    "Satellite": satellite
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Faulte_Line": faultlines
    };
    
    var myMap = L.map("map", 
    {
        center: [37.0902, -110.7129],
        zoom: 5,
        layers: [darkmap,faultlines,earthquakes]
    });
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
        }).addTo(myMap);

};

function markerSize(magnitude)
{
    return magnitude * 5;
};

// Define a color function that sets the colour of a marker based on earthquake magnitude
function depthColor(magnitude) {
    if (magnitude <= 10) {
        return "#a7fb09"
    } else if (magnitude <= 30) {
        return "#dcf900"
    } else if (magnitude <= 50) {
        return "#f6de1a"
    } else if (magnitude <= 70) {
        return "#fbb92e"
    } else if (magnitude <= 90) {
        return "#faa35f"
    } else {
        return "#ff5967"
    }
};






  
  
