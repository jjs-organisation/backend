const fsPromise = require('fs/promises');
const path = require('path');
const fs = require("fs");
const dataPath = path.resolve(`${__dirname}/../../../files/projects`)

class ProjectsFileSystem {
    async createProjectFolder(data, callback) {
        fs.mkdir(`${dataPath}/${data.user_id}/${data.project_id}`, {recursive:true}, function (err) {
            if(err){
                console.log(err)
            }else {
                callback({ result: 'null', err: 0 })
            }
        })
    }

    async readProjectFolder(data, callback) {
        let pathOfData = `${dataPath}/${data.user_id}/${data.project_id}`;
        async function walkDir(dir, result = {}) {
            let list = await fsPromise.readdir(dir);
            for(let item of list) {
                if (item === 'node_modules' || item === 'package-lock.json' ){}else {
                    const itemPath = path.join(dir, item);
                    let stats = await fsPromise.stat(itemPath)
                    if (await stats.isDirectory()) {
                        result[item] = {};
                        await walkDir(itemPath, result[item]);
                    } else {
                        const fileName = path.basename(item);
                        result[fileName] = (await fsPromise.readFile(itemPath)).toString();
                    }
                }
            }
            return result;
        }
        let result = await walkDir(pathOfData)
        callback({ result : result, err: 0 });
    }
}

class ProjectsDef {
    async getProjectConfig (data, callback) {
        fs.readFile(`${dataPath}/${data.user_id}/${data.project_id}/projectconfig.json`, {}, function (err,data) {
            if (err)
                console.log(err)
            else {
                callback({ result : JSON.parse(data.toString()), err: 0 })
            }
        })
    }
}

module.exports = {ProjectsDef, ProjectsFileSystem}