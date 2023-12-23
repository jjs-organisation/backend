"use strict";
const fs = require("fs");

(function () {
    module.exports = this.HostingCore = new class{
        initProject = async (path) => {
            // TODO: create init project command with Docker
        }

        runProject = async (path) => {
            // TODO: create run project command with Docker
        }
    }
    const DefaultPackageFile = {
        "name": "app-manifest",
        "version": "1.0.0",
        "description": "",
        "main": "index.js",
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1"
        },
        "author": "",
        "license": "ISC",
        "dependencies": {

        }
    }
    // const {Docker} = require('node-docker-api');
    // const docker = new Docker({ socketPath: '/var/run/docker.sock' });
    //
    // docker.container.create({
    //     Image: 'node',
    //     name: 'test'
    // })
    //     .then(container => container.start())
    //     .then(container => container.stop())
    //     .catch(error => console.log(error));
}.call(this));