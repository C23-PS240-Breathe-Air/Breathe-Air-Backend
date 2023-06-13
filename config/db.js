const mysql = require('mysql')
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createConnection({
    host: "34.101.213.192",
    user: "root", 
    password: "-J$VyCd^k$Z]$+6k",
    database: "bangkit"
});

module.exports = db;