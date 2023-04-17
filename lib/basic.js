const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

const instance = axios.create({
	timeout: 30000 // 30s timeout
});

module.exports.coords = {
	latitude: '38.4361982552',
	longitude: '-78.8706131842'
};

module.exports.getGoogleMinutes = async (lat, long) => {
	let url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${this.coords.latitude}%2C${this.coords.longitude}&origins=${lat}%2C${long}&units=imperial&key=${process.env.API_KEY}`;
	return await instance.get(url).then(res => res.data);
};

module.exports.getFlaskServerSpots = async (lat, long) => {
	let url = `${process.env.FLASK_SERVER_URL}/predict?latitude=${lat}&longitude=${long}`;
	return await instance.get(url).then(res => res.data).catch(err => console.error(err));
};

module.exports.getActualSpots = async () => {
	let url = "https://www.jmu.edu/cgi-bin/parking_sign_data.cgi?hash=53616c7465645f5f3e8cbf899bde04c11748d3b384e013968a884d8e4d1231ad5c4076a8cff7b606b6bfe52debd2dcb5b9095ef7beb5cfd3fe9e7766c68348c25a536b35149df79e477f49fecba19fd1|869835tg89dhkdnbnsv5sg5wg0vmcf4mfcfc2qwm5968unmeh5";
	return await instance.get(url).then(res => res.data);
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
