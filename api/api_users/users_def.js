const {QueryToMySql} = require("../lib/mysql");
const {genVerifyCode, genVerifyId, genUserId} = require("../lib/operations");
const supportMailer = require("../lib/mailer/support/mailer");
const {verificationLetter, registrationLetter} = require("../lib/mailer/support/letters");
const {createBillingRow} = require("../api_currency/default");

async function checkVerifyCode(code, verifyId, callback){
    try {
        await QueryToMySql(`
        SELECT * FROM \`verify\` WHERE \`id\`= '${verifyId}'
    `, function (err, res) {
            console.log(res)
            if (err)
                console.log(err)
            if (res){
                if (JSON.parse(res)[0].code.toString() === code){
                    console.log(`code true SQL: ${JSON.parse(res)[0].code} USER: ${code}`)
                    callback(true)
                }else
                    callback(false)
            }
        })
    }catch (e) {
        console.
        log(e)
    }
}

async function sendVerifyCode(name, mail, callback){
    let code = genVerifyCode();
    let id = genVerifyId();
    await QueryToMySql(`
        INSERT INTO \`verify\` (\`id\`, \`mail\`, \`code\`)
        VALUES ('${id}',
                '${mail}',
                '${code}')
    `, function (err, res) {
        if (err) {
            console.log(err)
        } else
            console.log(true);
    })
    try {
        await supportMailer.SendMail(mail, 'Verification', '', verificationLetter(name, code),
            function () {
                console.log('mb sent')
                console.log(code)
            })
        callback(id)
    }catch (e) {
        console.log(e)
    }
}

async function createUser(json, callback) {
    let received_data = json
    let uID = genUserId()
    console.log(received_data)
    await QueryToMySql(`
        INSERT INTO \`users\`(\`id\`, \`name\`, \`phone\`, \`mail\`,\`password\` ,\`country\`, \`datereg\`)
        VALUES (    '${uID}',
                    '${received_data.userdata.name}',
                    '${received_data.userdata.phone}', 
                    '${received_data.userdata.mail}',
                    '${received_data.userdata.password}',
                    '${received_data.userdata.country}',
                    '${received_data.userdata.dateofreg}'
               )`,
        function (err, res) {
            if (err) {
                console.log(err)
                callback(false)
            }else {
                try {
                    createBillingRow({ user_id: uID }, function (s) {
                        if (s)
                            console.log(s)
                    })
                    supportMailer.SendMail(received_data.userdata.mail,
                        `registration`,
                        `Welcome to UNIJS System!`,
                        registrationLetter(received_data.userdata.name, received_data.userdata.mail),
                        function (res) {
                            if (res === true)
                                console.log(`mail_sent`)
                            else
                                console.log(`mail_not_sent`)
                        })
                }catch (e) {
                    console.log(e)
                }
                console.log('user-created')
                callback({
                    name: received_data.userdata.name,
                    id: uID
                })
            }
        });
}

async function getUser(json, callback) {
    let received_data = json
    await QueryToMySql(`SELECT * FROM \`users\` WHERE \`id\`='${received_data.userid}'`,
        function (err, res) {
            if (err) {
                console.log(err)
                callback(false)
            }else {
                callback(JSON.parse(res)[0])
            }
        });
}

async function logIn(json, callback) {
    let received_data = json
    await QueryToMySql(
        `SELECT * FROM \`users\` WHERE \`mail\` = '${received_data.mail}'`,
        function (err, res) {
            try{
                let result = JSON.parse(res);
                if (err) {
                    console.log(err)
                    callback(false)
                }else {
                    if (result[0].password === received_data.password){
                        callback({
                            userid: result[0].id,
                            username: result[0].name
                        })
                    }else {
                        callback(false)
                    }
                }
            }catch (e) {
                console.log(e)
            }
        });
}

async function setSettings(json, callback){
    let user_id = json.user_id,
        session = json.session,
        user_name = json.new_userName;

    await getUser({userid: user_id}, function (res) {
        console.log(res + ' -- ' + user_name)
        if (res.name !== user_name) {
            QueryToMySql(`UPDATE \`users\` SET \`name\`='${user_name}' WHERE \`id\`='${user_id}'`,
                function (err,res) {
                    if (err)
                        console.log(err)
                    else
                        console.log("name_changed")
                })
        }
        QueryToMySql(`INSERT INTO \`clientsettings\`(\`user_id\`, \`session_lifetime\`, \`cookie_allow\`) 
        VALUES ('${user_id}','${session}','${true}')`,
            function (err,res) {
                if (err)
                    console.log(err)
                else
                    console.log('settings_saved')
            })
    })
}

module.exports = {
    logIn,
    createUser,
    checkVerifyCode,
    getUser,
    sendVerifyCode,
    setSettings
}