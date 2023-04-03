require('dotenv').config();
const express = require('express');
const { PythonShell } = require('python-shell');
const app = express();
const mongoose = require('mongoose');

const basicLib = require('./lib/basic');

const port = process.env.PORT || 3000;
const URI = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPWD}@cluster0.iz0pkfv.mongodb.net/?retryWrites=true&w=majority`;

app.route('/').get((_, res) => {
    res.render('index');
});

app.get('/sign1', async (_, res) => {
    const data = await PythonShell.run('parse.py', null);
    return res.status(200).send(data);
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

app.get('/getParkingGarage', async (_, res) => {
    const parkingGarageNum = basicLib.getRandomInt(3);
    return res.send({parkingGarageNum}).status(200);
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
    console.log(`Server is listening on http://localhost:${port}`);
});

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});
