const express = require("express"),
    router = express.Router(),
    bodyparser = require("body-parser"),
    path = require("path"),
    cors = require("cors");
const {ProjectsFileSystem, ProjectsDef} = require("./projects_source");
router.use(cors({ origin: '*' }))
router.use(bodyparser.urlencoded({ extended: true }));
router.use(bodyparser.json());
router.post('/create', async (req, res) => {
    let body = req.body;
    await ProjectsFileSystem.prototype.createProjectFolder(body, function (result) {
        if (result.err === 1)
            res.status(500).send(result)
        else
            res.status(200).send(result)
    })
})
router.post('/getprojectdata', async (req, res) => {
    let body = req.body;
    await ProjectsDef.prototype.getProjectConfig(body, function (result) {
        if (result.err === 1)
            res.status(500).send(result)
        else
            res.status(200).send(result)
    })
})
router.post('/getprojectfiles', async (req, res) => {
    let body = req.body;
    await ProjectsFileSystem.prototype.readProjectFolder(body, function (result) {
        if (result.err === 1)
            res.status(500).send(result)
        else
            res.status(200).send(result)
    })
})
router.get('/test', () =>{
    console.log('working')
})
module.exports = router;