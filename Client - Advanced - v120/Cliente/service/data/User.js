const db = require('../database/mysql.js');

module.exports = class UserData{
    constructor(){}
    getUser(game_id){
        return new Promise((resolve, reject)=>{
            const sql = 'select * from users where game_id = "DN"';
            db.query(sql, [game_id])
            .then(function(result){
                resolve(result[0])
            })
            .catch(e=>{
                reject(e);
            })
        })
    }
}
