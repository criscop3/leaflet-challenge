const sampleData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(sampleData).then(function(data) {
    let locations = data.features;
    let quakeMarkers = [];

    // Loop through the to extract the latitude, longitude and depth
    for (let i = 0; i < locations.length; i++) {
        let magnitude = locations[i].properties.mag;
        let depth = locations[i].geometry.coordinates[2];

        // Set circle marker radius based on magnitude
        let radius = magnitude * 30000;

        // Set color based on depth
        let fillColor;
        if (depth < 10) fillColor = "#A3F600";
        else if (depth < 30) fillColor = "#DCF400";
        else if (depth < 50) fillColor = "#F7DB11";
        else if (depth < 70) fillColor = "#FDB72A";
        else if (depth < 90) fillColor = "#FCA35D";
        else fillColor = "#FF5F65";

        // Push the coordinates to the quakeMarkers array and set marker attributes
        quakeMarkers.push(
            L.circle([locations[i].geometry.coordinates[1], locations[i].geometry.coordinates[0]], {
                stroke: true,
                weight: 1,
                fillOpacity: 0.75,
                color: "black",
                fillColor: fillColor,
                radius: radius
            }).bindPopup("<h3>" + locations[i].properties.place + "</h3><hr><p>" + new Date(locations[i].properties.time) + "</p><hr><p>Magnitude: " + magnitude + "</p>")
        );
    }

    // Create street layer object
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create quakeMarkers layer object
    let quakes = L.layerGroup(quakeMarkers);

    // Create baseMap object
    let baseMaps = {
        "Street Map": street
    };

    // Create overlay object
    let overlayMaps = {
        "Earthquakes": quakes
    };

    //  Create map
    let myMap = L.map("map", {
        center: [39.88, -112.56],
        zoom: 6,
        layers: [street, quakes]
    });

    // Create toggle layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);


});

