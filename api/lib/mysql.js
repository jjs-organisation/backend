const mysql = require("mysql2");
const {query} = require("express");
const {stringify} = require("./operations");

function ConnectToMySql() {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "host",
        database: "unijs-test",
        password: "e48~q2Wo]#e$~*u#(jbY*G*@3_fA9sm+Y:bR4`jV_g6KGv4Ks]"
    });
    return connection;
}

function QueryToMySql(query_, callback) {
    ConnectToMySql().query(`${query_}`, async function (err, result , fields) {
        callback(err, stringify(result), fields);
    })
}

module.exports = {
    ConnectToMySql,
    QueryToMySql
}