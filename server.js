const express = require('express');
const { PythonShell } = require('python-shell');
const app = express();
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;
const URI = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPWD}@cluster0.iz0pkfv.mongodb.net/?retryWrites=true&w=majority`;

app.route('/').get((_, res) => {
    res.render('index');
});

app.get('/sign1', async (_, res) => {
    const data = await PythonShell.run('parse.py', null);
    return res.status(200).send(data);
    // try {
    //   const data = await PythonShell.run('parse.py', null);
      
    //   // parse the data as needed and save it to MongoDB
    //   const myData = new MyData({
    //     // map your data properties to your schema properties here
    //   });
    
    //   myData.save((err) => {
    //     if (err) {
    //       console.error(err);
    //       return res.status(500).send('Error saving data to database');
    //     }
    //     return res.status(200).send('Data saved successfully');
    //   });
    // } catch (err) {
    //   console.error('Error parsing data', err);
    //   return res.status(500).send('Error parsing data');
    // }
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

// mongoose.connect(URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// const connection = mongoose.connection;
// connection.once('open', () => {
//     console.log('MongoDB database connection established successfully');
// });
