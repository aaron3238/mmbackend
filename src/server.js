const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const dbUrl = "mongodb://root:example@mongo:27017"

var connectWithRetry = function() {
    return mongoose.connect(dbUrl, {dbName: "tutorial"}, function(err) {
        if (err) {
          console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
          setTimeout(connectWithRetry, 5000);
        } else {
          console.log("MongoDB connection established successfully");
        }
    });
}

connectWithRetry();
const app = express();
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

const port = 6969;
app.use(cors());
app.use(express.json());


const test = require('./routes/test');
const meeting = require('./routes/meeting');
const user = require('./routes/user');

app.use('/test', test);
app.use('/meeting', meeting);
app.use('/user', user);




app.listen(port, ()=>{console.log(`Server listening on port: ${port}`)});