require('dotenv').config();
const express = require('express');
const { PythonShell } = require('python-shell');
const app = express();
const mongoose = require('mongoose');

const basicLib = require('./lib/basic');
const checkValidLatLong = require('./utils/checkValidLatLong');

const port = process.env.PORT || 3000;
const URI = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPWD}@cluster0.iz0pkfv.mongodb.net/?retryWrites=true&w=majority`;

const { spawn } = require('child_process');

app.route('/').get((_, res) => {
    res.render('index');
});

app.get('/sign12', async (_, res) => {
    const data = await PythonShell.run('parse.py', null);
    return res.send(data);
});

app.get('/forecast1', async (_, res) => {
    const data = await basicLib.readCsv('forecast1.csv');
    return res.status(200).send(data);
});

app.get('/forecast12', async (_, res) => {
    const data = await basicLib.readCsv('forecast12.csv');
    return res.status(200).send(data);
});

app.get('/forecast14', async (_, res) => {
    const data = await basicLib.readCsv('forecast14.csv');
    return res.status(200).send(data);
});

app.get('/forecast', async (_, res) => {
    const script = spawn('python', ['forecast.py']);
  
    script.stdout.on('data', (data) => {
        res.send(data.toString());
    });
  
    script.stderr.on('data', (data) => {
        console.error(data.toString());
        res.status(500).send('Error executing forecast.py');
    });
  
    script.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
    });
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
    return res.send(data);
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
