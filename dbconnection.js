var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'liverpool',
  database : 'hw2_user'
});

exports.connection=connection;
