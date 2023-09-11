const express = require('express');
const keys = require('./config/keys.js');
const app = express();
const bodyParser = require('body-parser');

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Access-Control-Allow
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Check if it's a preflight request
  if (req.method === 'OPTIONS') {
    // Respond with HTTP OK status
    res.status(200).end();
  } else {
    // Move to the next middleware or route
    next();
  }
});

// Setting up DB
const mongoose = require('mongoose');
mongoose.connect(keys.mongoURI,);

// Setup database models
require('./model/Account');
require('./model/Player');

// Setup routes
require('./routes/authenticationRoutes')(app);
require('./routes/apiRoutes')(app);

app.listen(keys.port, () => {
    console.log("Listening on port " + keys.port);
});