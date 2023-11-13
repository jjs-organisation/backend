const {QueryToMySql} = require("./lib/mysql");
const {genUserId} = require("./lib/operations");
const express = require('express'),{
    build_path
} = require('../config'),
router = express.Router(),
bodyparser = require("body-parser");
const cors = require("cors");
router.use(bodyparser.urlencoded({ extended: false }))
router.use(bodyparser.json());
router.use(cors({
    origin: '*'
}));

async function createUser(json, callback) {
    let received_data = json
    let uID = genUserId()
    await QueryToMySql(`INSERT INTO \`users\`(\`id\`, \`name\`, \`phone\`, \`mail\`,\`password\` ,\`country\`, \`datereg\`)
        VALUES ('${uID}',
                '${received_data.userdata.name}',
                '${received_data.userdata.phone}', 
                '${received_data.userdata.mail}',
                '${received_data.userdata.password}',
                '${received_data.userdata.country}',
                '${received_data.userdata.dateofreg}')`,
        function (err, res) {
        if (err) {
            console.log(err)
            callback(false)
        }else {
            console.log('user-created')
            callback(true)
        }
    });
}

async function getUser(json, callback) {
    let received_data = json
    await QueryToMySql(`SELECT * FROM \`users\` WHERE \`id\`='${received_data.userid}'`,
        function (err, res) {
            if (err) {
                console.log(err)
                callback(false)
            }else {
                callback(res)
            }
        });
}

async function logIn(json, callback) {
    let received_data = json
    await QueryToMySql(
    `SELECT * FROM \`users\` WHERE \`name\` = '${received_data.name}'`,
    function (err, res) {
        let result = JSON.parse(res);
        console.log(JSON.parse(res))
        if (err) {
            console.log(err)
            callback(false)
        }else {
            console.log(received_data.password)
            if (result[0].password === received_data.password){
                callback(result[0].id)
            }else {
                callback(false)
            }
        }
    });
}

router.post('/create', async (req, res) => {
    let r = req.body;
    await createUser(r, function (re) {
        if (re === false)
            res.status(200).send(false)
        else
            res.status(200).send(true)
    })
})

router.post('/login', async (req, res) => {
    let r = req.body;
    await logIn(r, function (re) {
        if (re === false)
            res.status(200).send({ r: false })
        else
            res.status(200).send({ r: re })
    })
})

router.post('/get-data', async (req, res) => {
    let r = req.body;
    await getUser(r, function (re) {
        if (re === false)
            res.status(200).send({ r: false })
        else
            res.status(200).send({ r: re })
    })
})


module.exports = router;