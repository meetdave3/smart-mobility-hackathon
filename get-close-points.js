const fs = require('fs');
const turf = require('@turf/turf');
const darkAccCluster = require('./src/cluster-dark.json');

const THRESHOLD = 0.05;

const output = [];

const getNearest = (targetPoint, points) => {
  const nearest = turf.nearestPoint(targetPoint, points);
  return nearest;
}

const findNearest = (darkAccCluster, elem) => {
  const filterOutElem = (cluster) => cluster.features.filter((f, i) => i !== elem);
  const points = filterOutElem(darkAccCluster);

  if (darkAccCluster.features[elem]) {
    const nearestPoint = getNearest(darkAccCluster.features[elem], turf.featureCollection(points));

    if (nearestPoint.properties.distanceToPoint < THRESHOLD) {
      return nearestPoint;
    }
  }
}

const run = () => {
  for (let i = 0; i <= darkAccCluster.features.length; i++) {
    let result = findNearest(darkAccCluster, i);
    if (result) {
      output.push(result);
    }
  }

  fs.writeFileSync(
    'closest-cluster-for-dark.json',
    JSON.stringify(turf.featureCollection(output), null, 2),
    (err) => console.log(err)
  );

}

run();