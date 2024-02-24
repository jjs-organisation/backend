const {QueryToMySql} = require("../lib/mysql"),
    {genUserId, genProjectId, stringify} = require("../lib/operations"),
    express = require('express'),{ build_path } = require('../../config'),
    router = express.Router(),
    HostingCore = require('../lib/hosting-core'),
    bodyparser = require("body-parser"),
    {resolve} = require('path');
const {
    initializeCreateProject,
    fillProject,
    getProjects,
    runProject,
    loadProject
} = require("./projects");
const path = require("path");
const fs = require("fs");
cors = require("cors");
router.use(bodyparser.urlencoded({ extended: false }))
router.use(bodyparser.json());
router.use(cors({
    origin: '*'
}));

router.post('/create', async (req, res) => {
    let r = req.body;
    await initializeCreateProject(r, function (pid, pname) {
        res.status(200).send({
            r: {
                project_name: pname,
                project_id: pid
            }
        })
    })
})

router.post('/save', async (req, res) => {
    let r = req.body;
    await fillProject(r, function (a) {
        if (a)
            res.status(200).send(a)
    })
})

router.get('/viewhtml/:userid/:projectid', async (req,res) => {
    let uId = req.params.userid,
        pId = req.params.projectid;
    try {
        let html2 = fs.readFileSync(path.resolve(`${__dirname}../../../files/projects/${uId}/${pId}/index.html`),
            'utf-8')
        res.status(200).send(html2);
    } catch (e) {
        res.status(404).send('not found')
    }
});

router.post('/load', async (req, res) => {

    let r = req.body;
    await loadProject(r, async function (a, id) {
        if (a)
            res.status(200).send({
                project_files: a,
                project_id: id
            })
    })
})

router.post('/get', async (req, res) => {
    let r = req.body;
    await getProjects(r, function (re) {
        console.log(re)
        if (re === false)
            res.status(200).send(false)
        else
            try {
                res.status(200).send(re)
            }catch(e){
                try {
                    res.status(200).send(re)
                }catch (e) {
                    console.log('тут полная глина произошла')
                }
            }
    })
})

router.post('/run', async (req, res) => {
    let r = req.body;
    await runProject(r, function (re) {
        if (re === false)
            res.status(200).send(false)
        else
            res.status(200).send(true)
    })
})

module.exports = router;
/*
 * router.use(express.static(
 *         path.resolve(`${__dirname}../../../files/projects/${uId}/${pId}`)
 *     ))
 *     res.set('Content-Type', 'application/html')
 *     res.status(200).sendFile(
 *         path.resolve(`${__dirname}../../../files/projects/${uId}/${pId}/index.html`),
 *         function (err) {
 *             console.log(path.resolve(`${__dirname}../../../files/projects/${uId}/${pId}/index.html`))
 *         }
 *     );
 *res.status(200).render('htmlproject', {
        content: html2
    })
    *   // fs.readFile(path.resolve(`${__dirname}../../../files/projects/${uId}/${pId}/index.html`)
    //     ,(err,data)=>{
    //         if(err){
    //             console.log(err);
    //         } else {
    //             res.setHeader('Content-Disposition', 'inline; filename="index.html"');
    //             res.status(200).sendFile(data)
    //         }
    // })
*/