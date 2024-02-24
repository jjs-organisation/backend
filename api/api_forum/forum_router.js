const express = require("express"),
    router = express.Router(),
    bodyparser = require("body-parser"),
    cors = require("cors");
const {
    getThemes,
    getThemeById
} = require("./themes/themes_api");
const {
    forum_CreatePost,
    forum_getThemePosts,
    forum_GetPost,
    forum_GetUserPosts,
    forum_GetResponsePosts
} = require("./posts/posts_api");

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

router.post('/gettheme', async (req,res) => {
    await forum_getThemePosts(req.body.themeId, function (result) {
        res.status(200).send(result)
    })
})

router.post(`/getpost`, async (req,res) => {
    await forum_GetPost(req.body.post_id, function (result) {
        res.status(200).send(result)
    })
})

router.post(`/createpost`, async (req,res) => {
    await forum_CreatePost(req.body, function () {
        res.status(200).send(true)
    })
})

router.post(`/getuserposts`, async (req,res) => {
    await forum_GetUserPosts(req.body.user_id, function (result) {
        res.status(200).send(result)
    })
})

router.post(`/responsepost`, async (req,res) => {
    await forum_CreatePost(req.body, function () {
        res.status(200).send(true)
    })
})

router.post(`/getresponseposts`, async (req,res) => {
    await forum_GetResponsePosts(req.body.response_id, function (result) {
        res.status(200).send(result)
    })
})

module.exports = router;