const path = require('path'),
    fs = require('fs');
const {QueryToMySql} = require("../../lib/mysql");
const dataPath = path.resolve(`${__dirname}/../../../files/`)
function genUserId() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 10) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return `id${result}`;
}
class UsersFileSystem {
    async CreateDataFile (data, callback){
        //data = user_id
        fs.mkdir(`${dataPath}/${data.user_id}`, {
            recursive: true
        }, function (err, path) {
            if (err)
                console.log(err)
            else
                callback(true) // path created
        })
    }
}
class UsersDef {
    async CreateUser(data, callback){
        let user_id = genUserId();
        QueryToMySql(`INSERT INTO \`users\`(\`id\`, \`name\`, \`mail\`, \`password\`) 
        VALUES ('${user_id}','${data.user_name}','${data.user_mail}','${data.user_password}')`, async function (err, result) {
            if (err) {
                console.log(err)
                callback({result: 'null', err: 1})
            } else {
                await UsersFileSystem.prototype.CreateDataFile({
                    user_id: user_id
                }, function (result) {
                    if (result === true)
                        callback({result: user_id, err: 0})
                })
            }
        })
    }
    async LoginUser(data, callback){
        QueryToMySql(`SELECT * FROM \`users\` WHERE \`id\`='${data.user_id}' AND \`password\`='${data.user_password}'`,
            function (err,result) {
            if (err){
                console.log(err)
                callback({ result: 'null', err: 1 })
            }
            else if(!result){
                // ?password_wrong
                callback({ result: 'null_result', err: 0 })
            }
            else {
                callback({ result: result, err: 0 })
            }
        })
    }
    async DeleteAccount (data, callback){

    }
}
module.exports = {
    UsersDef
}