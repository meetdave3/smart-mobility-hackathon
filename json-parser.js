const utmObj = require('utm-latlng');
const utm = new utmObj('EUREF89'); //Default Ellipsoid is 'WGS 84'
const accidentsJson = require('./myOutputFile.json');
const turf = require('@turf/turf');
const fs = require('fs');

let lightQualityTypes = [];

const geoJson = {
  "type": "FeatureCollection",
  "features": []
}

let obj = {
  '"Dagslys"': [],
  '"Mørkt med vegbelysning"': [],
  '"Ukjent"': [],
  '"Tussmørke, skumring"': [],
  '"Mørkt uten vegbelysning"': [],
}

accidentsJson.forEach((a, i) => {
  const point = a['GEOMETRI'];
  // const speedLimit = a['SPEEDLIMIT'];
  const lightQuality = a['LIGHTQUALITY'];
  let X = point.split(' ')[1];
  let Y = point.split(' ')[2];

  if (X) {
    X = X.replace('(', '').trim();
  }

  if (Y) {
    Y = Y.replace(')"', '').trim();
  }

  const coords = utm.convertUtmToLatLng(X, Y, 33, 'V');
  const coordsArr = [coords.lng, coords.lat];

  if (!lightQualityTypes.includes(lightQuality)) {
    lightQualityTypes.push(lightQuality);
  }

  if (obj[lightQuality]) {
    obj[lightQuality].push(coords);
  }

  console.log(lightQuality);

  if (lightQuality === '"Mørkt med vegbelysning"') {
    console.log(i);
    if (typeof coords === 'object') {
      const point = turf.point(coordsArr);
      geoJson.features.push(point);
    }
  }
});

console.log(geoJson);

fs.writeFileSync(
  'clusterGeoJson-dark.json',
  JSON.stringify(geoJson, null, 2),
  (err) => console.log(err)
);


// console.log(obj);