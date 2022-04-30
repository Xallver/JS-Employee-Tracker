const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;

// MySQL information
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Codingrox#22!',
    database: 'YelnatsDB'
});

module.exports = db;