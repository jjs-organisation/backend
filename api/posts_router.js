const express = require('express'),{
        build_path
    } = require('../config'),
    supportMailer = require('./lib/mailer/support/mailer'),
    router = express.Router(),
    bodyparser = require("body-parser"),
    cors = require("cors"), {
        registrationLetter,
        verificationLetter
    } = require("./lib/mailer/support/letters"), {
        getProfileData, changePassword_logged
    } = require("./profile");
const {
    createBillingRow
} = require("./api_currency/default");
const {
    createPost,
    getPosts
} = require("./api_posts/posts_default");

router.use(bodyparser.urlencoded({
    extended: false
}))
router.use(bodyparser.json());
router.use(cors({
    origin: '*'
}));

router.post('/create', async (req, res) => {
    let title = req.body.title,
        user_id = req.body.user_id,
        content = req.body.content;
    await createPost(title, content, user_id, function (r) {
        if (r)
            res.status(200).send(true)
    })
})

router.post('/get', async (req, res) => {
    let user_id = req.body.user_id;
    await getPosts(user_id, function (result) {
        res.status(200).send(result)
    }) 
})

router.post('/edit', async (req, res) => {
    // ...
})

router.post('/delete', async (req, res) => {
    // ...
})

module.exports = router
