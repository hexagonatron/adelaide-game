const LOCAL_STORAGE_KEY = 'adelaide_game_state';
const markers = [];
const getChecked = () => {
    return document.querySelector("input[name=player]:checked").value;
}

const getDefaultState = () => ({ red: [], blue: [], green: [] });

const loadState = () => {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || getDefaultState();
}

const saveState = (state) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

const updateState = (suburb, newColor) => {
    console.log({ suburb, newColor });
    const currState = loadState();
    currState.red = currState.red.filter(s => s != suburb);
    currState.blue = currState.blue.filter(s => s != suburb);
    currState.green = currState.green.filter(s => s != suburb);
    if (newColor) {
        currState[newColor].push(suburb);
    }
    saveState(currState);
}

const getStyle = (color) => {
    if (!color) {
        return {
            color: 'black',
            weight: 1,
            fillOpacity: 0,
        }
    }
    return {
        color: color,
        fillOpacity: 0.2,
        weight: 2
    }
}

const hasSavedStyle = (suburb) => {
    const state = loadState();
    if (state.red.includes(suburb)) return 'red';
    if (state.blue.includes(suburb)) return 'blue';
    if (state.green.includes(suburb)) return 'green';
    return null;
}

const map = L.map('adelaide-map', {
    attributionControl: false,
}).setView([-34.9285, 138.6007], 12);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: false,
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

const suburbLayer = L.geoJSON(suburbs, {
    style: (feature) => {
        const savedStyle = hasSavedStyle(feature.properties.suburb);
        return getStyle(savedStyle);
    },
    onEachFeature: (feature, layer) => {
        layer.addEventListener('click', (e) => {
            const checked = getChecked();
            const currStyle = hasSavedStyle(feature.properties.suburb);
            console.log({ checked, currStyle });
            if (checked === currStyle) {
                updateState(feature.properties.suburb)
                layer.setStyle(getStyle());
                return;
            }
            layer.setStyle(getStyle(checked));
            updateState(feature.properties.suburb, checked);
        });
        // const marker = L.circle(feature.properties.center, { radius: 15, color: 'green', className: 'suburbCircle' });
        // marker.bindTooltip(feature.properties.suburb, {className: 'customTooltip'});
        // marker.on('mouseover', (e) => {
        //     console.log(e.sourceTarget.openPopup());
            
        // });
        // marker.on('mouseout', (e) => {
        //     console.log(e.sourceTarget.closePopup());
            
        // });
        // markers.push(marker);
    }
}).addTo(map);

document.querySelector('#clearBtn').addEventListener('click', (event) => {
    saveState(getDefaultState());
    suburbLayer.resetStyle();
});

const getDecimal = (deg, min, sec, sign) => {
    return (deg + (min / 60) + (sec / 3600)) * sign;
}
//34 48 S
//138 30 E
for (let i = 48; i <= 70; i++) {
    for (let j = 30; j <= 42; j++) {
        const marker = L.circle([getDecimal(34, i, 0, -1), getDecimal(138, j, 0, 1)], { radius: 15 });
        markers.push(marker);
    }
}
let markersOn = false;
const toggleMarkers = () => {
    if (markersOn) {
        markers.forEach(m => m.removeFrom(map));
    } else {
        markers.forEach(m => m.addTo(map));
    }
    markersOn = !markersOn;
}
toggleMarkers();

document.querySelector("#markerBtn").addEventListener('click', toggleMarkers);