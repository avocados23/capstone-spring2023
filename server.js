const express = require('express');
const app = express();
const cors = require('cors');

const port = process.env.PORT || 3002;

var whitelist = [process.env.URI, "http://localhost:3002"];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
};

app.use(cors(corsOptions));
app.set('view engine', 'ejs'); // Use EJS view engine to render our .ejs files

app.route('/').get((_, res) => {
    res.render('index');
});

// middleware configuration to output errors in testing
app.use((err, req, res, next) => {
    console.log('Error found in middleware of the app...');
    console.log(err);
});

app.listen(port, () => console.log('Server started on', port));