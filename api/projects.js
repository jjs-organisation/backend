const {QueryToMySql} = require("./lib/mysql"),
{genUserId, genProjectId, stringify} = require("./lib/operations"),
express = require('express'),{ build_path } = require('../config'),
    router = express.Router(),
    HostingCore = require('./lib/hosting-core'),
    bodyparser = require("body-parser"),
    {resolve} = require('path');
    cors = require("cors");
router.use(bodyparser.urlencoded({ extended: false }))
router.use(bodyparser.json());
router.use(cors({
    origin: '*'
}));

async function createProject(json, callback) {
    let received_data = json
    let uID = genProjectId()
    await QueryToMySql(`INSERT INTO \`projects\`(\`id\`, \`name\`, \`ownerid\`, \`type\`)
        VALUES ('${uID}',
                '${received_data.name}',
                '${received_data.ownerid}',
                '${received_data.type.toLowerCase()}')`,
        function (err, res) {
            if (err) {
                console.log(err)
                callback(false)
            }else {
                console.log('project-created')
                callback(true)
            }
        });
}

async function getProjects(json, callback) {
    let received_data = json;
    let uID = genProjectId()
    await QueryToMySql(`SELECT * FROM \`projects\` WHERE \`ownerid\` = '${received_data.ownerid}'`,
        function (err, res) {
            if (err) {
                console.log(err)
                callback(false)
            }else {
                console.log(res)
                try {
                    callback(res)
                }
                catch (e) {
                    callback(false)
                }
            }
        });
}

async function runProject(json, callback) {
    let pId = json.id;
    let uId = json.uid;
    let path = resolve(__dirname + `../../files/projects/${uId}/${pId}/`)
    await HostingCore.initProject(path).then(() => {
        setTimeout(async () => {
            await HostingCore.runProject(path)
        }, 10000) // TODO: set to 15000
    })
}

router.post('/create', async (req, res) => {
    let r = req.body;
    await createProject(r, function (re) {
        if (re === false)
            res.status(200).send(false)
        else
            res.status(200).send(true)
    })
})

router.post('/get', async (req, res) => {
    let r = req.body;
    await getProjects(r, function (re) {
        if (re === false)
            res.status(200).send(false)
        else
            try {
                res.status(200).send(re)
            }catch(e){
                try {
                    res.status(200).send(re)
                }catch (e) {
                    console.log('тут полная глина произошла')
                }
            }
    })
})

router.post('/run', async (req, res) => {
    let r = req.body;
    await runProject(r, function (re) {
        if (re === false)
            res.status(200).send(false)
        else
            res.status(200).send(true)
    })
})

module.exports = router;