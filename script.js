const getChecked = () => {
    return document.querySelector("input[name=player]:checked").value;
}
const map = L.map('adelaide-map', {
    attributionControl: false,
}).setView([-34.9285, 138.6007], 12);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: false,
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

L.geoJSON(suburbs, {
    style: (feature) => {
        return {
            color: 'black',
            weight: 1,
            fillOpacity: 0,
        }
    },
    onEachFeature: (feature, layer) => {
        layer.addEventListener('click', (e) => {
            const checked = getChecked();
            layer.setStyle({color: checked, fillOpacity: 0.2, weight: 2});
        })
    }
}).addTo(map);
