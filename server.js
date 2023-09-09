const express = require('express');
const keys = require('./config/keys.js');

const app = express();

// Setting up DB
const mongoose = require('mongoose');
mongoose.connect(keys.mongoURI,);

// Setup database models
require('./model/Account');

// Setup routes
require('./routes/authenticationRoutes')(app);

app.listen(keys.port, () => {
    console.log("Listening on port " + keys.port);
});