const express = require("express"),
    router = express.Router(),
    bodyparser = require("body-parser"),
    { PluginsFS, PluginsDB } = require('./plugins'),
    path = require("path"),
    plugins_path = path.resolve(`${__dirname}../../../files/plugins`),
    cors = require("cors");

router.use(bodyparser.urlencoded({
    extended: false
}))
router.use(bodyparser.json());
router.use(cors({
    origin: '*'
}));

// PluginsFS.prototype.createDir()
// console.log(PluginsFS.prototype.getPluginsList(function (res) {
//     console.log(res)
// }))
// PluginsDB.prototype.getPluginsList(function (res) {
//     console.log(res)
// })

router.get('/getall', async function (req, res) {
    await PluginsDB.prototype.getPluginsList(function (r) {
        res.status(200).send(r);
    })
})

router.post('/getimg/', async function (req,res) {
    let path_element = req.body.path;
    console.log(path.resolve(`${plugins_path}/${path_element}/icon.png`))
    res.status(200).sendFile(path.resolve(`${plugins_path}/${path_element}/icon.png`));
});

router.post('/getplugin/', async function(req, res) {
    let path_element = req.body.path;
    res.status(200).sendFile(path.resolve(`${plugins_path}/${path_element}/index.html`))
});

router.post('/getinfo', async function(req,res) {
    let path_element = req.body.path;
    PluginsDB.prototype.getPluginInfo(path_element, function (re) {
        res.status(200).send(re)
    })
});

router.post('/installplugin', async function(req,res) {
    let userId = req.body.user_id;
    let pluginId = req.body.plugin_id;
    await PluginsDB.prototype.installPlugin(userId, pluginId, function (result) {
        result === true
            ? res.status(200).send(true)
            : res.status(401).send(false)
    })
});

router.post('/getinstalled', async function(req,res) {
    let user_id = req.body.user_id;
    await PluginsDB.prototype.getInstalled(user_id, function (result) {
        res.status(200).send(result)
    })
})

router.post('/deleteall', async function(req, res) {
    let userId = req.body.user_id;
    await PluginsDB.prototype.DeleteAll(userId, function () {
        res.status(200).send(true)
    })
});

module.exports = router;