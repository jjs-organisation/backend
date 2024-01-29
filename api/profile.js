"use strict"
const {QueryToMySql} = require("./lib/mysql");

function getProfileData(json, callback) {
    QueryToMySql(`SELECT * FROM \`users\` WHERE \`id\`='${json.user_id}'`,
        function (err, data) {
            if (err)
                console.log(err)
            else
                callback(data)
        })
}

function changePassword_logged(json, callback) {
    let password_new = json.password,
        password_old = json.password_old,
        user_id = json.user_id;

    QueryToMySql(`SELECT * FROM \`users\` WHERE \`id\` = '${user_id}'`,
    function (err, res) {
        try{
            let result = JSON.parse(res);
            if (err) {
                console.log(err)
                callback(false)
            }else {
                if (result[0].password === password_old){
                    console.log(true)
                    QueryToMySql(`
                        UPDATE \`users\` SET \`password\`='${password_new}' WHERE \`id\`='${user_id}'`,
                        function (err, data) {
                            if (err)
                                console.log(err)
                            else
                                callback(true)
                        })
                }else {
                    console.log(false)
                    callback(false)
                }
            }
        }catch (e) {
            console.log(e)
        }
    });
}

function changePassword_not_logged() {

}

module.exports = {
    getProfileData,
    changePassword_logged
}