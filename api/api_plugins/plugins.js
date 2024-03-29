const fs = require('fs'),
    path = require('path'),
    plugins_path = path.resolve(`${__dirname}../../../files/plugins`),
    {stringify, createDirs} = require("../lib/operations"),
    mysql = require("mysql2");
const {QueryToMySql} = require("../lib/mysql");

function ConnectToMySql_plugins() {
    const connection = mysql.createConnection({
        connectionLimit : 30,
        host: "localhost",
        user: "host",
        database: "unijs-test-plugins",
        password: "e48~q2Wo]#e$~*u#(jbY*G*@3_fA9sm+Y:bR4`jV_g6KGv4Ks]"
    });
    console.log('connection ext')
    return connection;
}
function QueryToMySqlPlugins(query_, callback) {
    let con = ConnectToMySql_plugins()
    con.query(`${query_}`,
        function (err, result, fields) {
            try {
                callback(err, stringify(result), fields);
            }catch (e) {
                console.log(err)
                console.log(stringify(result))
                console.log(fields)
                console.log(e)
            }
        })
    con.end((err) => (console.log(err)))
}


class PluginsFS {
    constructor() {

    }
    async createDir (){
        fs.exists(plugins_path , (r) => {
            r === true
                ? console.log('created')
                : fs.mkdir(plugins_path, {recursive:true}, function (err) {
                    !err
                        ? console.log('created')
                        : console.log('error')
                })
        })
    }

    async getPluginsList (callback) {
        fs.readdir(plugins_path, {recursive: false}, function (err, files) {
            let finalList = [];
            files.map((v, i) => {
                if (!v.split('.')[1]) {
                    finalList.push(v)
                }
            })
            callback(finalList);
        })
    }
}

class PluginsDB {
    async getPluginsList (callback) {
        QueryToMySqlPlugins(`SELECT * FROM \`plugins\``, function (err,res) {
            if (err)console.log(err)
            else callback(res)
        })
    }
    async getPluginInfo (path_data, callback){
        QueryToMySqlPlugins(`SELECT * FROM \`plugins\` WHERE \`path\`='${path_data}'`,function (err,res) {
            if (err)console.log(err)
            else callback(res)
        })
    }
    async installPlugin(userId, pluginId, callback){
        QueryToMySqlPlugins(`SELECT \`plugins_list\` FROM \`plugins_installdb\` WHERE \`user_id\`='${userId}'`, function (err,result) {
            if (err)
                console.log(err)
            else
                result.length === 0
                    ? QueryToMySqlPlugins(`
                            INSERT INTO \`plugins_installdb\`(\`user_id\`, \`plugins_list\`)
                            VALUES ('${userId}','${pluginId}')`)
                    : QueryToMySqlPlugins(`
                            UPDATE \`plugins_installdb\`
                            SET \`plugins_list\`='${
                            JSON.parse(result)[0].plugins_list === ''
                                ? ''
                                : `${JSON.parse(result)[0].plugins_list},`
                            }${pluginId}'
                            WHERE \`user_id\`='${userId}'
                    `,function (err) {
                        if (err)
                            console.log(err)
                        else
                            callback(true)
                    })
        })
    }
    async getInstalled(userId, callback) {
        QueryToMySqlPlugins(`SELECT \`plugins_list\` FROM \`plugins_installdb\` WHERE \`user_id\`='${userId}'`, function (err,result) {
            if (err)
                console.log(err)
            else{
                if(JSON.parse(result)[0].plugins_list.length < 2){
                    QueryToMySqlPlugins(`SELECT * FROM \`plugins\` WHERE \`id\`='${
                        JSON.parse(result)[0].plugins_list
                    }'`, function (err,res) {
                        callback(res)
                    })
                }else {
                    const values = () => JSON.parse(result)[0].plugins_list.split(',').map((v, i, array) =>
                        i === JSON.parse(result)[0].plugins_list.split(',').length
                            ? `'${v}',`
                            : `'${v}'`
                    )
                    console.log(values())
                    QueryToMySqlPlugins(`SELECT * FROM \`plugins\` WHERE \`id\` IN (${values()})`, function (err,result2) {
                        !err
                            ? callback(result2)
                            : console.log(err)
                    })
                }
            }
        })
    }
    async DeleteAll (userId) {
        QueryToMySqlPlugins(`UPDATE \`plugins_installdb\` 
            SET \`plugins_list\`='' 
            WHERE \`user_id\`='${userId}'`, function (err) {
            if (err)
                console.log(err)
            else console.log('deleted for ' + userId)
        })
    }
    async DeletePlugin(userId, pluginId, callback){
        QueryToMySqlPlugins(`SELECT \`plugins_list\` FROM \`plugins_installdb\` WHERE \`user_id\`='${userId}'`,
            function (err,res,rows) {
                if (err)
                    callback(false)
                else {
                    let prevResult = JSON.parse(res)[0].plugins_list;
                    let resArray = [];
                    prevResult.split(',').forEach((el, i, array) => {
                        if (el !== pluginId)
                            resArray.push(el)
                    })
                    let finalArray = [];
                    resArray.toString().split(',').forEach((el, i) => {
                        if (i > 0)
                            finalArray.push(`,${el}`)
                        else
                            finalArray.push(`${el}`)
                    })
                    console.log(finalArray)
                    QueryToMySqlPlugins(`UPDATE \`plugins_installdb\` 
                        SET \`plugins_list\`='${finalArray}' 
                        WHERE \`user_id\`='${userId}'`, function (err, result) {
                        if (err)
                            callback(false)
                        else
                            callback(true)
                    })
                }
            })
    }
}
module.exports = {
    PluginsDB,
    PluginsFS
};