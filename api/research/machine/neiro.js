const express = require('express'),
    router = express.Router(),
    bodyparser = require("body-parser"),
    {resolve} = require('path');
const {recurrent} = require("brain.js");
cors = require("cors");
router.use(bodyparser.urlencoded({ extended: false }))
router.use(bodyparser.json());
router.use(cors({
    origin: '*'
}));
const net = new recurrent.LSTM();


router.post('/learn', async (req, res) => {
    let r = req.body;
    net.train([
        r.query
    ],{
        log: true,
        errorThresh: 0.0075,
        iterations: 2500,
        learningRate: 0.01,
        logPeriod: 10, // iterations between logging out --> number greater than 0
        callback: null, // a periodic call back that can be triggered while training --> null or function
        callbackPeriod: 10,
    })
    res.status(200).send({
        r: 'nice'
    })
})

router.post('/request', async (req, res) => {
    let r = req.body;
    const output = net.run('doe');
    console.log(output)
    res.status(200).send({
        r: output
    })
})

router.post('/run', async (req, res) => {

})

module.exports = router;