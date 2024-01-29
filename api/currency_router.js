const express = require("express"),
    router = express.Router(),
    bodyparser = require("body-parser"),
    cors = require("cors");

router.use(bodyparser.urlencoded({
    extended: false
}))
router.use(bodyparser.json());
router.use(cors({
    origin: '*'
}));

const {
    getBalance
} = require("./api_currency/default");

router.post(`/getbalance`, async (req, res) => {
    await getBalance(req.body, function (result) {
        console.log(result)
        res.status(200).send({ result })
    })
})

module.exports = router;