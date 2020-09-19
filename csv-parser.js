const csv = require("csvtojson/v2");
const csvFilePath = './accidents.csv';
const csvToJson = require('convert-csv-to-json');
let fileOutputName = 'myOutputFile.json';

csvToJson.generateJsonFileFromCsv(csvFilePath, fileOutputName);

csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    const firstEl = jsonObj[0];

    console.log({ firstEl });

    console.log({ firstEl: firstEl['GEOMETRI'] });

  });