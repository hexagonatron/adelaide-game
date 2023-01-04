const map = L.map('adelaide-map', {
    attributionControl: false,
}).setView([-34.9285, 138.6007], 12);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: false,
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

L.geoJSON(suburbs).addTo(map);

suburbs.features.forEach(suburb => {
    // L.tooltip(suburb.properties.center, {content: suburb.properties.suburb}).addTo(map);
})
// L.tooltip({permanent: true}).setLatLng({lon: 138.53080529039528,lat: -34.94615527120816}).setContent("test").addTo(map);