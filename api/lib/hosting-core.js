"use strict";
const os = require("os"),
    pty = require("node-pty"),
    shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
const fs = require("fs");

(function () {
    module.exports = this.HostingCore = new class{
        initProject = async (path) => {
            if (!fs.existsSync(`${path}/package.json`)){
                fs.writeFile(`${path}/package.json`, JSON.stringify(DefaultPackageFile),{}, function () {

                })
            }
            let term = pty.spawn(shell, [
                `cd ` + path.toString() + '\n',
                'npm i --force\n',
            ], {});
            term.on('data', async function (data) {
                await console.log(data)
            })
        }

        runProject = async (path) => {
            let term = pty.spawn(shell, [
                `cd ` + path.toString() + '\n',
                `node index.js \n`
            ], {});
            term.on('data', async function (data) {
                await console.log(data)
            })
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
}.call(this));