const LOCAL_STORAGE_KEY = 'adelaide_game_state';
const defaultState = {red: [], blue: [], green: []};
const getChecked = () => {
    return document.querySelector("input[name=player]:checked").value;
}

const loadState = () => {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || defaultState ;
}

const saveState = (state) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

const updateState = (suburb, newColor) => {
    console.log({suburb, newColor});
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
            console.log({checked, currStyle});
            if (checked === currStyle) {
                updateState(feature.properties.suburb)
                layer.setStyle(getStyle());
                return;
            }
            layer.setStyle(getStyle(checked));
            updateState(feature.properties.suburb, checked);
        })
    }
}).addTo(map);

document.querySelector('#clearBtn').addEventListener('click', (event) => {
    saveState(defaultState);
    suburbLayer.resetStyle();
})