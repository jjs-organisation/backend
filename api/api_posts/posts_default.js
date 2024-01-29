const {genPostId} = require("../lib/operations");
const {QueryToMySql} = require("../lib/mysql");

async function createPost(title, content,user_id , callback){
    let id = genPostId()
    QueryToMySql(`
        INSERT INTO \`posts\`(\`id\`, \`title\`, \`content\`, \`attachments\`, \`likes\`, \`reposts\`, \`dlikes\`, \`views\`, \`userId\`) 
        VALUES ('${id}','${title}','${content}','...','0','0','0','0', '${user_id}')
    `, function (err, res) {
        if (err)
            console.log(err)
        else
            callback(true) // post created
    })
}

async function getPosts(user_id, callback){
    QueryToMySql(`SELECT * FROM \`posts\` WHERE \`userId\`='${user_id}'`,
    function (err, res) {
        if (err)
            console.log(err)
        else
            callback(res) // posts found
    })
}

module.exports = {
    createPost,
    getPosts
}