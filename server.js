require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const xmlParser = require('xml2json');

const basicLib = require('./lib/basic');
const checkValidLatLong = require('./utils/checkValidLatLong');
const checkValidLatLongMultiple = require('./utils/checkValidLatLongMultiple');

const port = process.env.PORT || 3000;
const URI = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPWD}@cluster0.iz0pkfv.mongodb.net/?retryWrites=true&w=majority`;

app.route('/').get((_, res) => {
    res.render('index');
});

app.get('/getParkingGarage', async (_, res) => {
    const parkingGarageNum = basicLib.getRandomInt(3);
    return res.send({parkingGarageNum}).status(200);
});

app.get('/getMinutes', checkValidLatLong, async (req, res) => {
    const lat = req.query.latitude;
    const long = req.query.longitude;
    const googleDistanceMatrixObject = await basicLib.getGoogleMinutes(lat, long);
    if (googleDistanceMatrixObject.rows[0].elements[0].status === 'ZERO_RESULTS') {
        return res.status(500).send({minutes: 0});
    }
    return res.send({minutes: (googleDistanceMatrixObject.rows[0].elements[0].duration.value / 60)});
});

app.get('/getMinutesWithDest', checkValidLatLongMultiple, async (req, res) => {
    const destLat = req.query.destLat;
    const destLong = req.query.destLong;
    const clientLat = req.query.clientLat;
    const clientLong = req.query.clientLong;

    const googleDMO = await basicLib.getDuration(clientLat, clientLong, destLat, destLong);
    if (googleDMO.rows[0].elements[0].status === 'ZERO_RESULTS') {
        return res.status(500).send({minutes: 0});
    }
    return res.send({duration: (googleDMO.rows[0].elements[0].duration.text)});
});

app.get('/predict', checkValidLatLong, async (req, res) => {
    const lat = req.query.latitude;
    const long = req.query.longitude;

    console.log('Passed in lat and long:', lat, long)

    const etaToChamps = await basicLib.getMinutesFromDestPrettified(lat, long, 38.43502599007161, -78.87410192849666);
    const etaToMason = await basicLib.getMinutesFromDestPrettified(lat, long, 38.441077053986234, -78.87189939666584);
    const etaToWarsaw = await basicLib.getMinutesFromDestPrettified(lat, long, 38.44049301960376, -78.8775374000211);

    const data = await basicLib.getFlaskServerSpots(lat, long);
    let json_obj = {parkingData: []};
    json_obj.parkingData.push({
        name: "Warsaw Avenue Parking Deck",
        spotsPredicted: basicLib.round(Number(data[0]), 0),
        coordinate: {
            latitude: 38.43502599007161,
            longitude: -78.87410192849666,
        },
        time: etaToChamps.duration
    });
    json_obj.parkingData.push({
        name: "Mason Street Parking Deck",
        spotsPredicted: basicLib.round(Number(data[1]), 0),
        coordinate: {
            latitude: 38.441077053986234, 
            longitude: -78.87189939666584,
        },
        time: etaToMason.duration
    });
    json_obj.parkingData.push({
        name: "Champions Parking Deck",
        spotsPredicted: basicLib.round(Number(data[2]), 0),
        coordinate: {
            latitude: 38.44049301960376,
            longitude: -78.8775374000211,
        },
        time: etaToWarsaw.duration
    });
    return res.send(json_obj);
});

app.get('/actual', checkValidLatLong, async (req, res) => {
    const lat = req.query.latitude;
    const long = req.query.longitude;

    const data = await basicLib.getActualSpots();
    const etaToChamps = await basicLib.getMinutesFromDestPrettified(lat, long, 38.43502599007161, -78.87410192849666);
    const etaToMason = await basicLib.getMinutesFromDestPrettified(lat, long, 38.441077053986234, -78.87189939666584);
    const etaToWarsaw = await basicLib.getMinutesFromDestPrettified(lat, long, 38.44049301960376, -78.8775374000211);

    let xmlToJSON = JSON.parse(xmlParser.toJson(data));
    let champsDeckInfoJSON = {
        title: "Champions Parking Deck",
        availableSpots: xmlToJSON.decks["ZoneVacanSpaces"][1]["Result"],
        coordinate: {
            latitude: 38.43502599007161,
            longitude: -78.87410192849666,
        },
        time: etaToChamps.duration
    };
    let masonDeckInfoJSON = {
        title: "Mason Street Parking Deck",
        availableSpots: xmlToJSON.decks["ZoneVacanSpaces"][xmlToJSON.decks["ZoneVacanSpaces"].length-2]["Result"],
        coordinate: {
            latitude: 38.441077053986234, 
            longitude: -78.87189939666584,
        },
        time: etaToMason.duration
    };
    let warsawDeckInfoJSON = {
        title: "Warsaw Avenue Parking Deck",
        availableSpots: xmlToJSON.decks["ZoneVacanSpaces"][4]["Result"],
        coordinate: {
            latitude: 38.44049301960376,
            longitude: -78.8775374000211,
        },
        time: etaToWarsaw.duration
    };

    let allParkingData = {
        parkingData: [warsawDeckInfoJSON, masonDeckInfoJSON, champsDeckInfoJSON]
    }
    return res.send(allParkingData);
});

app.get('/testRoute', async (_, res) => {
    res.json("Hello world!");
});

app.use((err, req, res, next) => {
    console.log('Error found in middleware of the app...');
    console.log(err);
});

app.set('view engine', 'ejs');
app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});
