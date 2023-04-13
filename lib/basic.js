const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

module.exports.coords = {
	latitude: '38.4361982552',
	longitude: '-78.8706131842'
};

module.exports.getGoogleMinutes = async (lat, long) => {
	let url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${this.coords.latitude}%2C${this.coords.longitude}&origins=${lat}%2C${long}&units=imperial&key=${process.env.API_KEY}`;
	return await axios.get(url).then(res => res.data);
};

module.exports.getRandomInt = function (max) {
    return Math.floor(Math.random() * max);
};

module.exports.readCsv = function(filename) {
	return new Promise((resolve, reject) => {
		const results = [];

		fs.createReadStream(filename)
		.pipe(csv())
		.on('data', (data) => results.push(data))
		.on('end', () => resolve(results))
		.on('error', (error) => reject(error));
	});
};
