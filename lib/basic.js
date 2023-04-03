module.exports.getRandomInt = function (max) {
    return Math.floor(Math.random() * max);
};

// function to read CSV files from back-end
const fs = require('fs');
const csv = require('csv-parser');

async function readCsv(filename) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filename)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

module.exports = { readCsv };