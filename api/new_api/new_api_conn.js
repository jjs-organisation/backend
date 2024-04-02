const express = require("express"),
    router = express.Router(),
    bodyparser = require("body-parser"),
    path = require("path"),
    users_router = require('./users/users_router'),
    projects_router = require('./projects/projects_router'),
    cors = require("cors");

router.use('/users/', users_router)
router.use('/projects/', projects_router)
router.use(cors({ origin: '*' }))
module.exports = router;