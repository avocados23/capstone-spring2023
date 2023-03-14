require('dotenv').config();
const express = require('express');
const { PythonShell } = require('python-shell');
const app = express();
const mongoose = require('mongoose');

const basicLib = require('./lib/basic');

const port = process.env.PORT || 3000;
const URI = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPWD}@cluster0.iz0pkfv.mongodb.net/?retryWrites=true&w=majority`;

const { spawn } = require('child_process');

app.route('/').get((_, res) => {
    res.render('index');
});

app.get('/sign1', async (_, res) => {
    const data = await PythonShell.run('parse.py', null);
    return res.send(data);
<<<<<<< HEAD
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
    //const parkingGarageNum = basicLib.getRandomInt(3);
    const parkingGarageNum = predict();
    return res.send({parkingGarageNum}).status(200);
=======
>>>>>>> e7c0b28 (procfile)
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
