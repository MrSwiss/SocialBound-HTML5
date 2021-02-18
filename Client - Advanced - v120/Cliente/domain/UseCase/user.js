
const UserData = require('../../service/data/User');

var UserUC = {};

UserUC.getUser = async (game_id)=>{
    const userData = new UserData();
    const data = await userData.getUser(game_id);
    const info = await data;
    return info;
}

module.exports = UserUC;