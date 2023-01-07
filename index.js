const p = require('polylabel');
const suburbs = require('./suburbs.js');
const fs = require('fs');

suburbs.features.forEach(s => {
    s.properties.center = p(s.geometry.coordinates[0]).slice(0,2).reverse();
});
suburbs.features.forEach(s => console.log(s.properties.center));

fs.writeFile('suburbs1.json', JSON.stringify(suburbs), (e) => e? console.log(e): console.log('Done'));