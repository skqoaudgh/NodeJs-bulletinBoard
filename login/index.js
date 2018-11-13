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
function tryLogin(user_id, user_pwd) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user_pwd, salt);
    return User.find({id: user_id, pw: hash});
}

function isExisted(user_id, callback) {
    User.find({id: user_id}, function(err, user) {
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
        res.render('main', {
            nickname: sess.user_uid+1 ? tmp.nick : ''
        });       
    })
});

route.get('/login', (req, res) => {
    res.render('login');
});
route.post('/login', (req, res) => {
    const body = req.body;
    if(tryLogin(body.user_id, body.user_pwd)) {
        User.findOne({id: body.user_id}, function(err,user) {
            if(err) console.log(err);
            req.session.user_uid = user._id;
            res.redirect('/');
        }); 
    } 
    else {
        res.send('비밀번호가 일치하지 않음');
    }
});

route.get('/logout', (req, res) => {
    delete req.session.user_uid;
    res.redirect('/');
});

route.get('/regist', (req, res) => {
    res.render('regist');
});

route.post('/regist', (req, res) => {
    const body = req.body;
    isExisted(body.user_id, function(flag) {
        if(flag) {
            var user = new User();
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(body.user_pwd, salt);
    
            user.id = body.user_id;
            user.pw = hash;
            user.nick = body.user_nickname;
            user.registed_date = new Date(moment().format('YYYY-MM-DD/HH:mm:ss'));
    
            user.markModified('user')
            user.save(function(error){
                if(error){
                    console.error(error);
                    res.send('예외오류 발생');
                    return;
                }
                res.redirect('/login');
            });
        }
        else {
            res.send('이미 존재하는 아이디');
        }
    })
});

module.exports = route;