const express = require('express');

console.log("Hello World!");

const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test');

// Routes
app.get('/auth', async (req, res)=>{
    console.log(req.query);
    res.send("Hello World!" + "It is " + Date.now());
});

const port = 13756;
app.listen(port, ()=>{
    console.log("Listening on port " + port);
});