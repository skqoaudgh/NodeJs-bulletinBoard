var express    = require('express');
    bcrypt     = require('bcrypt-nodejs');
    route      = express.Router();
    moment     = require('moment');
    nodemailer = require('nodemailer');

// TIMEZONE CINFIG
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

// DEFINE MODEL
var User = require('../db/models/user');

// 사용자가 입력한 ID, PW가 데이터베이스에 저장되어 있는지 검사하여 true/false를 반환하는 함수
function tryLogin(user_id, user_pwd, callback) {
    User.find({id: user_id}, function(err, user) {
        var result = true;
        if(user.length == 0) result = false;
        if(err) result = false;
        if(!bcrypt.compareSync(user_pwd, user[0].pw)) result = false;
        if(result)
            callback(user[0]);
        else
            callback('');
    });
}

// 파라미터로 넘어온 아이디가 DB에 존재하는지 검사하여 true/false를 반환하는 함수
function isIDExisted(user_id, callback) {
    User.find({id: user_id}, function(err, user) {
        var result = true;
        if(user.length > 0) result = false;
        if(err) result = false;
        callback(result);
    });
}

// 파라미터로 넘어온 닉네임이 DB에 존재하는지 검사하여 true/false를 반환하는 함수
function isNickExisted(user_nick, callback) {
    User.find({nick: user_nick}, function(err, user) {
        var result = true;
        if(user.length > 0) result = false;
        if(err) result = false;
        callback(result);
    });
}

// 파라미터로 넘어온 이메일로 인증 메일을 발송하는 함수
function SendMail(email) {
    const salt = bcrypt.genSaltSync(10);
    const hashToken = bcrypt.hashSync("MAKEUSTOKEN", salt);
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'makeus.noreply@gmail.com',
            pass: '23468917a!'
        }
    });
 
    let mailOptions = {
        from: 'makeus.noreply@gmail.com',
        to: email ,
        subject: '메이커스 계정 인증',
        html: '<p>아래의 링크를 클릭해주세요 !</p>' + "<a href='http://localhost:7777/authmail/?email=" + email + "&token="+ hashToken + "'>인증하기</a>"
    };
 
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
}

route.get('/', (req, res) => {
    const sess = req.session;
    if(!sess.user_uid)
        res.render('form', {
            error : '0'
        });
    else
        res.redirect('main');
});

route.get('/main', (req, res) => {
    const sess = req.session;
    if(!sess.user_uid)
        res.render('form', {
            error : '0'
        });
    else
        res.render('main');
});

route.post('/login', (req, res) => {
    const body = req.body;
    tryLogin(body.login_id, body.login_pwd, function(user) {
        if(user)
        {
            if(!user.confirmed) {
                res.render('form', {error: '5'});
                SendMail(user.email);
            }
            else {
                req.session.user_uid = user._id;
                res.redirect('main');
            }
        }
        else {
            res.render('form', {error: '3'});
        }
    });
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
                    user.confirmed = false;
                    user.registed_date = new Date(moment().format('YYYY-MM-DD/HH:mm:ss'));
            
                    user.markModified('user')
                    user.save(function(error){
                        if(error){
                            res.send('예외오류 발생');
                            return;
                        }
                        res.render('reg_succed', {user_email: user.email});
                    });

                    SendMail(user.email);

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

route.post('/requestMail', (req, res) => {
    const salt = bcrypt.genSaltSync(10);
    const hashToken = bcrypt.hashSync("MAKEUSTOKEN", salt);

    let email = req.body.reg_email;
 
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'makeus.noreply@gmail.com',
            pass: '23468917a!'
        }
    });
 
    let mailOptions = {
        from: 'makeus.noreply@gmail.com',
        to: email ,
        subject: '메이커스 계정 인증',
        html: '<p>아래의 링크를 클릭해주세요 !</p>' + "<a href='http://localhost:7777/authmail/?email=" + email + "&token='" + hashToken + "'>인증하기</a>"
    };

    console.log(mailOptions);
 
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
});

route.get('/authmail', (req, res) => {
    let mail = req.query.email;
    let token = req.query.token;

    if(bcrypt.compareSync("MAKEUSTOKEN",token))
    {
        User.findOne({email:mail}, function(err, user) {
            if(err) return console.log(err);
            user.confirmed = true;
            user.save(function(error){
                if(error) return console.log(error);
            });
        });
    }
    res.redirect('/mailauth');
});

route.get('/mailauth', (req, res) => {
    res.render('mailauth');
});

module.exports = route;