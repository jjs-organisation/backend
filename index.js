"use strict";
global.XMLHttpRequest = require( 'xhr2');

const express = require("express"),
    app = express(),
    port = 3450,
    sport = 3451,
    http = require("http"),
    cors = require('cors'),
    path = require("path"),
    new_api = require('./api/new_api/new_api_conn'),
    fs = require("fs"),
    https = require("https"),
    key = fs.readFileSync(__dirname + '/sert/localhost/ru1/selfsigned.key'), //ru1/unijs.key
    cert = fs.readFileSync(__dirname + '/sert/localhost/ru1/selfsigned.crt'), //ru1/unijs.crt
    options = {
        key: key,
        cert: cert
    },
    server_http = http.createServer(app),
    server_https = https.createServer(options, app),
    bodyparser = require("body-parser"),
    allowedOrigins = {
        origin: '*'
    };

app.set('view engine', 'pug');
app.set('views', './api/views/');
app.use('/newapi/', new_api);
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors(allowedOrigins));
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next();
});

app.get('/po',() => {
    console.log({ message: 'listen' })
});

app.get('/', (req, res) => {
    res.send('Now using https..');
});

server_http.listen(port, () => {
    console.log(`server running at http://95.163.233.114:${port} || http://localhost:${port}`)
});

server_https.listen(sport, () => {
    console.log(`server running at https://95.163.233.114:${sport} || https://localhost:${sport}`)
});