const mysql = require('mysql2/promise');


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Amit@123',
  database: 'registration_app',  
  waitForConnections: true,
  connectionLimit: 10,
});


module.exports = { pool };
