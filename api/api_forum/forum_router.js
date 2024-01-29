const express = require("express"),
    router = express.Router(),
    bodyparser = require("body-parser"),
    cors = require("cors");
const {
    getThemes,
    getThemeById
} = require("./themes/themes_api");

router.use(bodyparser.urlencoded({
    extended: false
}))
router.use(bodyparser.json());
router.use(cors({
    origin: '*'
}));

router.get('/getallthemes', async  (req,res) => {
     await getThemes(function (r) {
         res.status(200).send(r)
     })
});

router.get('/gettheme/:themeid', async (req,res) => {
    await getThemeById(req.params.themeid, function (result) {
        res.status(200).send(result)
    })
})

module.exports = router;