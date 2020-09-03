var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_barrm',
  password        : '6468',
  database        : 'cs290_barrm'
});

module.exports.pool = pool;