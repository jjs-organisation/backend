const {QueryToMySql} = require("./lib/mysql");
const {genUserId, genProjectId, stringify} = require("./lib/operations");
const express = require('express'),{ build_path } = require('../config'),
    router = express.Router(),
    bodyparser = require("body-parser");
const cors = require("cors");
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
                console.log('projects-found')
                try {
                    callback(res)
                }
                catch (e) {
                    callback('xui')
                }
            }
        });
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

module.exports = router;