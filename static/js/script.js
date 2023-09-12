// define bounds
var southWest = L.latLng(-85, -180);
var northEast = L.latLng(85, 180);

var bounds = L.latLngBounds(southWest, northEast);
var map = L.map('map', {
    // zoomControl: false,
    minZoom: 2,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0
    }).setView([0, 0], 2);

// create cluster group
var markers = L.markerClusterGroup();

// fetch data from USGS earthquake API
fetch('/earthquakes')
    .then(response => response.json())
    .then(data => {
        data.forEach(earthquake => {
            // set custom icon
            const eqIcon = L.icon({
                iconUrl: "static/earthquake.png",
                iconSize: [30, 30],
                iconAnchor: [5, 15],
                popupAnchor: [-10, -20]
            });


            const eqMarker = L.marker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
                icon: eqIcon
            });

            // convert unix timestamp to UTC
            let unix_timestamp = earthquake.properties.time;
            var date = new Date(unix_timestamp);
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            var seconds = "0" + date.getSeconds();
            var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            var formattedDate = date.toLocaleDateString("en-US")
            
            // add tooltip with earthquake details
            eqMarker.bindTooltip(`<strong>Time:</strong> ${formattedDate} ${formattedTime} UTC<br><strong>Magnitude:</strong> ${earthquake.properties.mag}<br><strong>Location:</strong> ${earthquake.properties.place}`);

            markers.addLayer(eqMarker)
    });
    map.addLayer(markers)
    map.fitBounds(markers.getBounds());
}); 


// add basemap layers
var basemaps = {
    "ESRI_WorldStreetMap": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 15,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012, <a href="https://www.freepik.com/icon/earthquake_1684394#fromView=resource_detail&position=6">Icon by Freepik</a>'
    }),
    "OSM": L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 15,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://www.freepik.com/icon/earthquake_1684394#fromView=resource_detail&position=6">Icon by Freepik</a>'
    }),
}

// set default basemap
basemaps["ESRI_WorldStreetMap"].addTo(map);

// create basemap control
L.control.layers(basemaps).addTo(map);