var express = require('express');
    route   = express.Router();

// DEFINE MODEL
var User = require('../db/models/user');

route.get('/', (req, res) => {
    const sess = req.session;
    User.findOne({_id: sess.user_uid}, {nick:1},  function(error, users){
        var tmp = new User(users);
        res.render('main', {
            nickname: sess.user_uid+1 ? tmp.nick : ''
        });
    })
});

module.exports = route;