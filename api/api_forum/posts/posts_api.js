const {QueryToMySql} = require("../../lib/mysql");
const {genBillId} = require("../../lib/operations");
const {getThemeById} = require("../themes/themes_api");

async function forum_CreatePost(body, callback){
    let trimmedString = body.content.substr(0, 147);
    trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))

    QueryToMySql(`
    INSERT INTO \`forum_posts\`(\`id\`, \`title\`, \`theme\`, \`user_id\`,\`user_name\`, \`content\`, \`preview\`, \`response_id\`)
    VALUES ('${genBillId()}',
            '${body.title}',
            '${body.theme}',
            '${body.user_id}', 
            '${body.user_name}' ,
            '${body.content}',
            '${trimmedString === undefined
                        ? body.content 
                        : trimmedString+ '...'}',
            '${!body.response_id 
                  ? '' 
                  : body.response_id }')`,
        function (err,res) {
            if (err)
                console.log(err)
        })
}

async function forum_getThemePosts(themeId, callback){
    await getThemeById(themeId, function (res) {
        QueryToMySql(`SELECT * FROM \`forum_posts\` 
         WHERE \`theme\` = '${JSON.parse(res)[0].name}'`, function (err, res1) {
            if (err)
                console.log(err)
            callback(res1)
        })
    })
}

async function forum_GetPost(postId, callback){
    await QueryToMySql(
        `SELECT * FROM \`forum_posts\` WHERE \`id\`='${postId}'`
    ,function (err,res) {
        if (err)
            console.log(err)
        callback(res)
    })
}

async function forum_GetUserPosts(user_id, callback){
    await QueryToMySql(`
    SELECT * FROM \`forum_posts\` WHERE \`user_id\`='${user_id}'`,
    function (err,res) {
        if (err)
            console.log(err)
        callback(res)
    })
}

async function forum_GetResponsePosts(response_id, callback){
    await QueryToMySql(
        `SELECT * FROM \`forum_posts\` 
         WHERE \`response_id\`='${response_id}'`
        ,function (err,res) {
            if (err)
                console.log(err)
            callback(res)
        })
}



module.exports = {
    forum_CreatePost,
    forum_getThemePosts,
    forum_GetPost,
    forum_GetUserPosts,
    forum_GetResponsePosts
}