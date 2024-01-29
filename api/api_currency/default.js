const {QueryToMySql} = require("../lib/mysql");
const {genBillId} = require("../lib/operations");

async function getBalance(json, callback){ // TODO: Fill billing database
    let user_id = json.user_id;
    await QueryToMySql(`SELECT * FROM \`bill\` WHERE \`ownerid\`='${user_id}'`,
    function(err, result) {
        if (err)
            console.log(err)
        else {
            try {
                console.log(JSON.parse(result)[0].balance)
                callback(JSON.parse(result)[0].balance)
            }catch (e) {
                callback('zero')
            }
        }
    })
}

async function createBillingRow(json, callback) {
    let billId = genBillId(),
        currency = 'USD',
        ownerid = json.user_id,
        balance = 0;

    await QueryToMySql(
`INSERT INTO \`bill\`(\`id\`, \`balance\`, \`currency\`, \`ownerid\`) 
         VALUES ('${billId}','${balance}','${currency}','${ownerid}')`,
        function () {
            console.log('billing created')
            callback(true)
        }
    )
}

module.exports ={
    getBalance,
    createBillingRow
}