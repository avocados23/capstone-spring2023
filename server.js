require('dotenv').config()
const express = require('express');
const { PythonShell } = require('python-shell');
const app = express();
const port = process.env.PORT || 3002;
const mongoose = require('mongoose');
const URI = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPWD}@cluster0.iz0pkfv.mongodb.net/?retryWrites=true&w=majority`;

app.route('/').get((_, res) => {
    res.render('index');
});

app.get('/sign1', async (_, res) => {
    const data = await PythonShell.run('parse.py', null);
    return res.status(200).send(data);
});

app.use((err, req, res, next) => {
    console.log('Error found in middleware of the app...');
    console.log(err);
});

app.listen(port, () => console.log('Server started on', port));

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});