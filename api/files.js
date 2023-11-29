const {QueryToMySql} = require("./lib/mysql");
const {genUserId, genProjectId, stringify, upload, uploadFiles, createDirs} = require("./lib/operations");
const express = require('express'),{ build_path } = require('../config'),
    router = express.Router(),
    bodyparser = require("body-parser"),
    cors = require("cors"),
    multer = require("multer"),
    busboy = require('connect-busboy'), //middleware for form/file upload
    path = require('path'),     //used for file path
    fs = require('fs-extra'),
    fsDef = require('fs');
router.use(busboy());
router.use(bodyparser.urlencoded({ extended: false }))
router.use(bodyparser.json());
router.use(cors({
    origin: '*'
}));


router.post('/upload/:userId/:projectId',async (req, res) => {
    const userId = req.params.userId;
    const projectId = req.params.projectId;
    const path = __dirname +`../../files/projects/${userId}/${projectId}/`
    createDirs(path, async function () {})
    let fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', async function (fieldname, file, filename) {
        console.log("Uploading: " + filename.filename);
        fstream = fs.createWriteStream(path + filename.filename);
        await file.pipe(fstream);
        fstream.on('close', function () {
            console.log("Upload Finished of " + filename.filename);
            res.status(200).send(true)
        });
    });
});

module.exports = router;