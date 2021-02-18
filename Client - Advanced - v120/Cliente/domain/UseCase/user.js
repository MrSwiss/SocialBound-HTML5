
const UserData = require('../../service/data/User');

var UserUC = {};

UserUC.getUser = async ()=>{
    const userData = new UserData();
    const data = await userData.getUser();
    const info = await data;
    return info;
}

module.exports = UserUC;