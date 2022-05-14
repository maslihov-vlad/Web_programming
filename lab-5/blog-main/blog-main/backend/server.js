const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3001;
/**
 * https://medium.com/wesionary-team/create-your-first-rest-api-with-node-js-express-and-mongodb-447fce535385
 * @type {string}
 */
const dbPath = 'mongodb://localhost/blog_db';
const options = {useNewUrlParser: true, useUnifiedTopology: true};
const mongo = mongoose.connect(dbPath, options);

const userRoutes = require('./controller/UserController');
const articleRoutes = require('./controller/ArticleController');
const subscribeRoutes = require('./controller/SubscriptionController');

mongo.then(() => {
    console.log('connected');
}, error => {
    console.log(error, 'error');
});

//Check DB Connection
if (!mongoose.connection)
    console.log("Error connecting db");
else
    console.log("DB Connected Successfully");

app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

// Login & auth
app.use('/api', userRoutes);
// Articles stuff
app.use('/api', articleRoutes);
// Subscriptions stuff
app.use('/api', subscribeRoutes);

app.listen(port);
