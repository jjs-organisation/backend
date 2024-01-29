const {QueryToMySql, ConnectToMySql} = require("../lib/mysql"),
{
    genUserId,
    genProjectId,
    stringify
} = require("../lib/operations"),
express = require('express'),{
    build_path
} = require('../../config'),
    router = express.Router(),
    HostingCore = require('../lib/hosting-core'),
    bodyparser = require("body-parser"),
    { resolve } = require('path');
const fs = require("fs");
const {Docker_createProject} = require("./hosting");
    cors = require("cors");
router.use(bodyparser.urlencoded({ extended: false }))
router.use(bodyparser.json());
router.use(cors({
    origin: '*'
}));

async function initializeCreateProject (json, callback) {
    let project_id = genProjectId();
    let user_id = json.user_id,
        project_name = json.project_name,
        user_name = json.user_name,
        type = json.project_type;
    if (ConnectToMySql){
        await fs.mkdir(`${__dirname}../../../files/projects/${user_id}/${project_id}/`, {
            recursive: true
        }, async function (err, path) {
            try {
                if (err)
                    console.log(err)
                else {
                    await QueryToMySql(`INSERT INTO \`projects\`(\`id\`, \`name\`, \`ownerid\`, \`type\`) 
                        VALUES ('${project_id}','${project_name}','${user_id}','${type}')`,
                        function (err) {
                            if (err)
                                console.log(err)
                            else {
                                console.log('SQL: project-created')
                            }
                        })
                    await fs.writeFile(`${path}/projectconfig.json`, JSON.stringify(createProjectConfig(
                        project_name,
                        project_id,
                        user_id,
                        user_name
                    )), function () {
                        console.log('FS: project-created')
                        callback(project_id, project_name)
                    })
                }
            }catch (e) {
                console.log(e)
            }
        })
    } else
         console.log('It seems like no connection to SQL server' )
}

function createProjectConfig(project_name, id , uid, uname) {
    let projectParams = { // default config file
        project: {
            name: project_name,
            version: '1.0.0',
            id: id, // project id
            user_id: uid, // user id
            type: 'nodejs',//lang
            hosting: {
                entry: '', // entry file like ./index.html
                name: '', // name in hosting (mb same as def project name)
                requires_load: false, // needs to npm i in project
                launch_script: 'node index.js'
            },
            gitignore: '/node_modules',
            package_json: {
                name: project_name,
                version: "1.0.0",
                dependencies: {
                    // add list
                },
                author: uname
            }
        }
    }
    return projectParams;
}

async function fillProject(json, callback) {
    let userId = json.user_id,
        projectId = json.project_id,
        code = {
            js: json.code.js,
            html: json.code.html,
            css: json.code.css
        }
    await fs.writeFile(`${__dirname}../../../files/projects/${userId}/${projectId}/index.html`,
        code.html, function () {
    })
    await fs.writeFile(`${__dirname}../../../files/projects/${userId}/${projectId}/style.css`,
        code.css, function () {
    })
    await fs.writeFile(`${__dirname}../../../files/projects/${userId}/${projectId}/script.js`,
        code.js, function () {
    })
    callback('project-filled')
}

async function getProjects(json, callback) {
    let uid = json.ownerid;
    // Check projects in SQL then in files
    function f(callback) {
        QueryToMySql(`SELECT * FROM \`projects\` WHERE \`ownerid\`= '${uid}';`,
            function (err, result) {
                if (err)
                    console.log(err)
                else {
                    fs.readdir(`${__dirname}../../../files/projects/${uid}/`, {}, function (err,files) {
                        if (err)
                            console.log(err)
                        else{
                            callback(result, files)
                        }
                    })
                }
            })
    }
    f(function (result, files) {
        // if (result.length !== files.length){
        //     if (result.length > files.length){
        //         // delete from sql
        //     }
        //     else if(result.length < files.length){
        //         // delete from fs
        //     } else
        //         console.log('Unknown error in getProjects function')
        // }else {
            callback(result)
        //}
    })
}

function getProjectByName(name, callback) {
    QueryToMySql(`SELECT * FROM \`projects\` WHERE \`name\`='${name}'`, function (err, res) {
        if (err)
            console.log(err)
        else {
            console.log(JSON.parse(res.toString())[0].id)
            callback(JSON.parse(res.toString())[0].id)
        }
    })
}

async function loadProject(json, callback) {
    let uid = json.user_id,
    files = [
        'script.js',
        'index.html',
        'style.css'
    ]
    await getProjectByName(json.project_name, function (res) {
        let project_id = res;
        let final = []
        function f2(callback){
            let final = [],
            i = 0;
            files.forEach((file) => {
                i++;
                try {
                    function f(callback) {
                        fs.readFile(`${__dirname}../../../files/projects/${uid}/${project_id}/${file}`,
                        function (err, data) {
                            if (err)
                                console.log(err)
                            else
                            {
                                callback({[file.split('.')[1]]: data.toString()})
                            }
                        })
                    }
                    f(function (data) {
                        if (i === files.length){
                            final.push(data)
                            callback(final)
                        }
                        else final.push(data)
                    })
                }catch (e) {
                    console.log(e)
                }
            })
        }
        f2(async function (d) {
            if (await d.length === files.length)
                callback(await d, project_id)
        })
    });
}

async function runProject(json, callback) {
    let uid = json.user_id,
        project_id = json.project_id;
    // run as HTML
    Docker_createProject()
}
module.exports = {
    initializeCreateProject,
    fillProject,
    getProjects,
    loadProject,
    runProject
}
