var express = require('express'),
    router = express.Router();
var config = require('../../../Config/config');
var mysql = require('mysql');
var Logger = require('../../Controller/lib/logger');
var ignoreCase = require('ignore-case');
var md5 = require('md5');
var constants = require('constants');
const UserUseCase = require('../../domain/UseCase/user');
var db = require('../../Controller/data');

function Commatize(b) {
    return b.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,")
}

function getAvatar(id) {
    var itm = [];
    var res = [];
    for (var i = 0; i < db.length; i++) {
        var n = db[i];
        if (n[0] == id) {
            itm = n;
            break;
        }
    }
    if (itm !== null && itm.length > 0) {
        res.push(itm[2]);
        res.push(itm[4]);
        res.push(itm[7]);
    }
    return res;
}

function ArrayToObject(a, b) {
    var c, d = b.length,
        e = {};
    for (c = 0; c < d; c++)
        e[b[c]] = a[c];
    return e
}

function getDateTime(date) {
    var d = new Date(date);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var days = d.getDate();
    var month = months[d.getMonth()];
    var year = d.getFullYear();

    var h = d.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
    var time = month + ' ' + days + ', ' + year + ', ' + h;
    return time
}

router.get('/', async function(req, res) {
    var login = false;
    var loguser = "";
    if (req.session.account_id) {
        login = true;
        loguser = req.session.game_id;
    }
    res.render('search_user', {
        login: login,
        login_id: loguser,
        error: ''
    });
});

router.post('/', function(req, res) {
    var login = false;
    var loguser = "";
    var search_name = req.body.name;
    var search_id = req.body.id;
    Logger.info('Name: ' + search_name + ' - ID: ' + search_id);
    if (req.session.account_id) {
        login = true;
        loguser = req.session.game_id;
    }
    if (search_name !== '') {
        req.db.connection.getConnection().then(conn => {
            conn.query('SELECT game_id FROM users WHERE game_id = ?', [search_name])
                .then(rows1 => {
                    conn.release();
                    if (rows1[0].length > 0) {
                        var rows_x1 = rows1[0];
                        res.redirect('/user/' + rows_x1[0].game_id);
                    } else {
                        res.render('search_user', {
                            login: login,
                            login_id: loguser,
                            error: 'Name not found'
                        });
                    }
                });
        });
    } else if (search_id !== '' && isNaN(search_id) === false) {
        req.db.connection.getConnection().then(conn => {
            conn.query('SELECT game_id FROM users WHERE IdAcc = ?', [search_id])
                .then(rows1 => {
                    conn.release();
                    if (rows1[0].length > 0) {
                        var rows_x1 = rows1[0];
                        res.redirect('/user/' + rows_x1[0].game_id);
                    } else {
                        res.render('search_user', {
                            login: login,
                            login_id: loguser,
                            error: 'UserID not found'
                        });
                    }
                });
        });
    } else {
        res.render('search_user', {
            login: login,
            login_id: loguser,
            error: 'UserID not found'
        });
    }
});
router.get('/:game_id', async function(req, res){
    const { game_id } = req.params;
    const name_user = renderGameId(game_id);
    const dataUser = await UserUseCase.getUser(name_user);
    const Info = {
        user: dataUser,
    }
    console.log(Info)
    res.render('info', Info);
});

function renderGameId(game_id) {
    game_id = mysql.escape(game_id).replace("'", "").replace("'", "");
    game_id = game_id.toLowerCase();
    return game_id
};
module.exports = router;