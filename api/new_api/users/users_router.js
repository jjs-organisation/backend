const express = require("express"),
    router = express.Router(),
    bodyparser = require("body-parser"),
    path = require("path"),
    {UsersDef} = require('./users_source'),
    cors = require("cors");
router.use(cors({ origin: '*' }))
router.post('/register', async (req, res) => {
    let body = req.body;
    await UsersDef.prototype.CreateUser(body, function (result) {
        if (result.err === 0)
            res.status(200).send(result.result)
        else
            res.status(500).send(result.err)
    })
})
router.post('/login', async (req, res) => {
    let body = req.body;
    await UsersDef.prototype.LoginUser(body, function (result) {
        if (result.err === 0 && result.result !== 'null_result')
            res.status(200).send(result.result)
        else
            res.status(500).send(result.err)
    })
})
router.post('/deleteaccount', (req    ,res) => {
    let body = req.body;
    // await UsersDef.prototype.CreateUser(body, function (result) {
    //     if (result.err === 0)
    //         res.status(200).send(result.result)
    //     else
    //         res.status(500).send(result.err)
    // })
})
router.get('/test', () =>{
    console.log('working')
})
module.exports = router;