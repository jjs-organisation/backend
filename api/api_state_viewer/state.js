const express = require("express"),
    router = express.Router(),
    bodyparser = require("body-parser"),
    cors = require("cors");

router.get('/view/backend_server', (req,res) => {
    res.status(200).send(true)
})
module.exports = router;