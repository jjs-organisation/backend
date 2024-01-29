const
    {
        QueryToMySql
    } = require("./lib/mysql"),
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
    } = require("./lib/mailer/support/letters"),
    {
        getProfileData, changePassword_logged
    } = require("./profile"),
    {
        logIn,
        sendVerifyCode,
        checkVerifyCode,
        createUser,
        getUser,
        setSettings
    } = require('./api_users/users_def')

const {createBillingRow} = require("./api_currency/default");

router.use(bodyparser.urlencoded({
    extended: false
}))
router.use(bodyparser.json());
router.use(cors({
    origin: '*'
}));


router.post('/create', async (req, res) => {
    let r = req.body;
    let mail = r.userdata.mail;
    let verified = r.verified;
    if (verified === true){
        await createUser(r, function (re) {
            res.status(200).send({ r: {
                username : re.name,
                id: re.id
            }})
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

router.post('/getdata', async (req, res) => {
    let r = req.body;
    console.log('dsfdf')
    await getUser(r, function (re) {
        if (re === false)
            res.status(417).send(false)
        else
            res.status(200).send({ r: re })
    })
})

router.post('/getprofile', async (req, res) => {
    let r = req.body;
    await getProfileData(r, function (re) {
        res.status(200).send({
            r: re
        })
    })
})

router.post('/changepasswordlogged', async (req,res) => {
    let r = req.body;
    await changePassword_logged(r, function (re) {
        if (re !== false)
            res.status(200).send({
                r: re
            })
    })
})

router.post('/settings_set', async (req,res) => {
    let r = req.body;
    await setSettings(r, function (res1) {
        if (res1)
            res.status(200).send(true)
    })
})

module.exports = router;