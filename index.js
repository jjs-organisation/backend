"use strict";
const express = require("express"),
    app = express(),
    router_default = require('./api/def_routes'),
    router_users = require('./api/users'),
    router_projects = require('./api/projects'),
    router_files = require('./api/files'),
    port = 3000,
    cors = require('cors'),
    path = require("path"),
    bodyparser = require("body-parser");

app.use('/projects/', router_projects);
app.use('/users/', router_users);
app.use('/files/', router_files);

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

app.listen(port,() => {
    console.log({ message: 'listen' })
});

app.get('/po',() => {
    console.log({ message: 'listen' })
});