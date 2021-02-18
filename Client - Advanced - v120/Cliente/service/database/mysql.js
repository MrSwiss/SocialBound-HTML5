const mysql = require('mysql');

const pool  = mysql.createPool({
  host            : 'localhost',
  user            : 'root',
  password        : 'wilmerdelgado',
  database        : 'game'
});

const query = (sql) => {
  return new Promise((resolve, reject) => {

    pool.query(sql, function(error, results, fields) {
        if (error) {
          console.error(error.sqlMessage);
          return reject(new Error(error));
        }
        resolve(results);
    });
  });
}

module.exports = { query };