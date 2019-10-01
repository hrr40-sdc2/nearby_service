const newrelic = require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const http = require('http');
const https = require('https');
const compression = require('compression');
const controller = require('./controllers.js');

http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

const app = express();
const port = 8081;

app.use(express.static(path.join(__dirname, '/../public')));
app.use(bodyParser.json());
app.use(cors());
app.use(compression());

app.post('/houses', controller.createRental);
app.get('/houses/:zip', controller.findNearbyRentals);
app.patch('/houses/:id', controller.updateRental);
app.delete('/houses/:id', controller.deleteRental);

app.listen(port);

module.exports = app;
