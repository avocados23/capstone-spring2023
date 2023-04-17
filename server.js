require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const xmlParser = require('xml2json');

const basicLib = require('./lib/basic');
const checkValidLatLong = require('./utils/checkValidLatLong');

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

app.get('/predict', checkValidLatLong, async (req, res) => {
    const lat = req.query.latitude;
    const long = req.query.longitude;

    const data = await basicLib.getFlaskServerSpots(lat, long);
    let json_obj = {data: []};
    json_obj.data.push({
        name: "Warsaw Avenue Parking Deck",
        spotsPredicted: data[0]
    });
    json_obj.data.push({
        name: "Mason Street Parking Deck",
        spotsPredicted: data[1]
    });
    json_obj.data.push({
        name: "James Madison University Main Parking Deck",
        spotsPredicted: data[2]
    });
    return res.send(json_obj);
});

app.get('/actual', async (_, res) => {
    const data = await basicLib.getActualSpots();
    let xmlToJSON = JSON.parse(xmlParser.toJson(data));
    return res.send(xmlToJSON);
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
