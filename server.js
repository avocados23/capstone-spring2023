const express = require('express');
const { PythonShell } = require('python-shell')
const app = express();
const port = process.env.PORT || 3002;

app.set('view engine', 'ejs');

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