const {QueryToMySql} = require("../../lib/mysql");

async function getThemes(callback){
    QueryToMySql(`SELECT * FROM \`forum_themes\``, function (err,result) {
        if (err)
            console.log(err)
        else
            callback(result)
    })
}

async function getThemeById(id, callback){
    QueryToMySql(`SELECT * FROM \`forum_themes\` WHERE \`id\`='${id}'`, function (err,res) {
        if (err)
            console.log(err)
        else
            callback(res)
    })
}

module.exports = {
    getThemes,
    getThemeById
}