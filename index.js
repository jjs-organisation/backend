"use strict";
const express = require("express"),
    app = express(),
    router_users = require('./api/users'),
    router_projects = require('./api/projects'),
    router_files = require('./api/files'),
    neiro_api = require('./api/research/machine/neiro'),
    port = 3450,
    sport = 3451,
    http = require("http"),
    cors = require('cors'),
    path = require("path"),
    fs = require("fs"),
    https = require("https"),
    key = fs.readFileSync(__dirname + '/sert/localhost/ru1/selfsigned.key'), //ru1/unijs.key
    cert = fs.readFileSync(__dirname + '/sert/localhost/ru1/selfsigned.crt'), //ru1/unijs.crt
    bodyparser = require("body-parser"),
    options = {
        key: key,
        cert: cert
    };

app.use('/projects/', router_projects);
app.use('/users/', router_users);
app.use('/files/', router_files);
app.use('/neiro/', neiro_api);
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json());
app.use(cors({
    origin: '*'
}));
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next();
})

app.get('/po',() => {
    console.log({ message: 'listen' })
});

app.get('/', (req, res) => {
    res.send('Now using https..');
});

const server_http = http.createServer(app);
const server_https = https.createServer(options, app);


server_http.listen(port, () => {
    console.log(`server running at http://95.163.233.114:${port} || http://localhost:${port}`)
});

server_https.listen(sport, () => {
    console.log(`server running at https://95.163.233.114:${sport} || https://localhost:${sport}`)
});