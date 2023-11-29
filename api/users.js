const
    {QueryToMySql} = require("./lib/mysql"),
    {
        genUserId,
        genVerifyId,
        genVerifyCode
    } = require("./lib/operations"),
    express = require('express'),{
        build_path
    } = require('../config'),
    supportMailer = require('./lib/mailer/support/mailer'),
    router = express.Router(),
    bodyparser = require("body-parser"),
    cors = require("cors"),
    {
        registrationLetter,
        verificationLetter
    } = require("./lib/mailer/support/letters");

router.use(bodyparser.urlencoded({ extended: false }))
router.use(bodyparser.json());
router.use(cors({
    origin: '*'
}));

async function checkVerifyCode(code, verifyId, callback){
    try {
        await QueryToMySql(`
        SELECT * FROM \`verify\` WHERE \`id\`= '${verifyId}'
    `, function (err, res) {
            console.log(res)
            if (err)
                console.log(err)
            if (res){
                if (JSON.parse(res)[0].code.toString() === code){
                    console.log(`code true SQL: ${JSON.parse(res)[0].code} USER: ${code}`)
                    callback(true)
                }else
                    callback(false)
            }
        })
    }catch (e) {
        console.
            log(e)
    }
}

async function sendVerifyCode(name, mail, callback){
    let code = genVerifyCode();
    let id = genVerifyId();
    await QueryToMySql(`
        INSERT INTO \`verify\` (\`id\`, \`mail\`, \`code\`)
        VALUES ('${id}',
                '${mail}',
                '${code}')
    `, function (err, res) {
        if (err) {
            console.log(err)
        } else
            console.log(true);
    })
    try {
        await supportMailer.SendMail(mail, 'Verification', '', verificationLetter(name, code),
            function () {
                console.log('mb sent')
        })
        callback(id)
    }catch (e) {
        console.log(e)
    }
}

async function createUser(json, callback) {
    let received_data = json
    let uID = genUserId()
    console.log(received_data)
    await QueryToMySql(`
        INSERT INTO \`users\`(\`id\`, \`name\`, \`phone\`, \`mail\`,\`password\` ,\`country\`, \`datereg\`)
        VALUES (    '${uID}',
                    '${received_data.userdata.name}',
                    '${received_data.userdata.phone}', 
                    '${received_data.userdata.mail}',
                    '${received_data.userdata.password}',
                    '${received_data.userdata.country}',
                    '${received_data.userdata.dateofreg}'
               )`,
        function (err, res) {
        if (err) {
            console.log(err)
            callback(false)
        }else {
            try {
                supportMailer.SendMail(received_data.userdata.mail,
                    `registration`,
                    `Welcome to UNIJS System!`,
                    registrationLetter(received_data.userdata.name, received_data.userdata.mail),
                    function (res) {
                        if (res === true)
                            console.log(`mail_sent`)
                        else
                            console.log(`mail_not_sent`)
                    })
            }catch (e) {
                console.log(e)
            }
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
        console.log('res')
        console.log(res)
        console.log('res')
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
    let mail = r.userdata.mail;
    let verified = r.verified;
    if (verified === true){
        await createUser(r, function (re) {
            res.status(200).send({ r: re })
        })
    }else {
        await sendVerifyCode(r.userdata.name, mail, function (re) {
            res.status(200).send({
                r: re
            })
        })
    }
})

/** !CREATE_VERIFY_CODE */
router.post('/create/verify', async (req, res) => {
    let r = req.body;
    await checkVerifyCode(r.code, r.id, function (re) {
        if (re === true){
            console.log(true)
            res.status(200).send({ r: true })
        }
        else
            res.status(200).send({ r: false })
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