var express    = require('express');
    bcrypt     = require('bcrypt-nodejs');
    route      = express.Router();
    moment     = require('moment');

// TIMEZONE CINFIG
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

// DEFINE MODEL
var User = require('../db/models/user');

// 사용자가 입력한 ID, PW가 데이터베이스에 저장되어 있는지 검사하여 true/false를 반환하는 함수
function tryLogin(user_id, user_pwd, callback) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user_pwd, salt);
    User.find({id: user_id, pw: hash}, function(err, user) {
        var result = true;
        if(user.length == 0) result = false;
        if(err) result = false;
        callback(result);
    });
}

function isIDExisted(user_id, callback) {
    User.find({id: user_id}, function(err, user) {
        var result = true;
        if(user.length > 0) result = false;
        if(err) result = false;
        callback(result);
    });
}

function isNickExisted(user_nick, callback) {
    User.find({nick: user_nick}, function(err, user) {
        var result = true;
        if(user.length > 0) result = false;
        if(err) result = false;
        callback(result);
    });
}

route.get('/', (req, res) => {
    const sess = req.session;
    User.findOne({_id: sess.user_uid}, {nick:1},  function(error, users){
        var tmp = new User(users);
        res.render('form', {
            error : '0'
        });
    })
});

route.post('/login', (req, res) => {
    const body = req.body;
    tryLogin(body.login_id, body.login_pwd, function(flag) {
        if(flag)
        {
            req.session.user_uid = user._id;
            res.redirect('/main');
        }
        else {
            res.render('form', {error: '3'});
        }
    })
});

route.get('/logout', (req, res) => {
    delete req.session.user_uid;
    res.redirect('/');
});

route.post('/regist', (req, res) => {
    const body = req.body;
    isIDExisted(body.reg_id, function(flag) {
        if(flag) {
            isNickExisted(body.reg_nick, function(flag2) {
                if(flag2) {
                    var user = new User();
                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(body.reg_pwd, salt);
            
                    user.id = body.reg_id;
                    user.pw = hash;
                    user.nick = body.reg_nick;
                    user.email = body.reg_email;
                    user.registed_date = new Date(moment().format('YYYY-MM-DD/HH:mm:ss'));
            
                    user.markModified('user')
                    user.save(function(error){
                        if(error){
                            console.error(error);
                            res.send('예외오류 발생');
                            return;
                        }
                        res.redirect('/reg_succed');
                    });
                }
                else {
                    res.render('form', {error: '2'});
                }
            });
        }
        else {
            res.render('form', {error: '1'});
        }
    })
});

route.get('/reg_succed', (req, res) => {
    res.render('reg_succed');
});
module.exports = route;