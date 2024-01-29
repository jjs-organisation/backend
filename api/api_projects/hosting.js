"use strict";
const {Docker} = require('node-docker-api');
const docker = new Docker({socketPath: '/var/run/docker.sock'}); ///var/run/docker.sock

function initializeDocker() {
    docker.container.list()
        .then(r => console.log(r))
}

function Docker_createProject() {


    docker.container.create({
        Image: 'nodejs',
        name: 'project1'
    }).then(container => container.logs({
        follow: true,
        stdout: true,
        stderr: true
    })).then(stream => {
        stream.on('data', info => console.log(info))
        stream.on('error', err => console.log(err))
    }).catch(error => console.log(error));
}

function Docker_runProject() {

}
module.exports ={
    Docker_createProject
}