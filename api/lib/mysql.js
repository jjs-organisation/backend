const mysql = require("mysql2");
const {query} = require("express");
const {stringify} = require("./operations");

function ConnectToMySql() {
    const connection = mysql.createConnection({
        connectionLimit : 30,
        host: "localhost",
        user: "host",
        database: "unijs-test",
        password: "e48~q2Wo]#e$~*u#(jbY*G*@3_fA9sm+Y:bR4`jV_g6KGv4Ks]"
    });
    console.log('connection ext')
    return connection;
}

function QueryToMySql(query_, callback) {
    let con = ConnectToMySql()
    con.query(`${query_}`,
        function (err, result, fields) {
            callback(err, stringify(result), fields);
        })
    con.end((err) => (console.log(err)))
}

function QueryToMySqlPlugins(query_, callback) {
    let con = ConnectToMySql()
    con.query(`${query_}`,
        function (err, result, fields) {
            callback(err, stringify(result), fields);
        })
    con.end((err) => (console.log(err)))
}


module.exports = {
    ConnectToMySql,
    QueryToMySql
}