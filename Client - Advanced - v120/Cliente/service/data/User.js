const db = require('../database/mysql.js');

module.exports = class UserData{
    constructor(){}
    getUser(){
        return new Promise((resolve, reject)=>{
            const sql = 'select * from users';
            db.query(sql)
            .then(function(result){
                resolve(result)
            })
            .catch(e=>{
                reject(e);
            })
        })
    }
}
