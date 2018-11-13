var express = require('express');
var router = express.Router();

module.exports = function(User) {
    // GET ALL USERS
    router.post('/', function(req, res){
        User.find(function(err, users){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(users);
        })
    });

    // GET SINGLE USER
    router.get('/:user_id', function(req, res){
        User.findOne({_id: req.params.user_id}, function(err, user){
            if(err) return res.status(500).json({error: err});
            if(!user) return res.status(404).json({error: 'user not found'});
            res.json(user);
        })
    });

    // GET BOOKS BY ID
    router.get('/id/:id', function(req, res){
        User.find({author: req.params.id}, {_id: 0, title: 1, registed_date: 1},  function(err, users){
            if(err) return res.status(500).json({error: err});
            if(users.length === 0) return res.status(404).json({error: 'user not found'});
            res.json(users);
        })
    });

    // CREATE USER
    router.post('/', function(req, res){
        var user = new User();
        user.id = req.body.id;
        user.pw = req.body.pw;
        user.registed_date = new Date(req.body.registed_date);

        user.save(function(err){
            if(err){
                console.error(err);
                res.json({result: 0});
                return;
            }
            res.json({result: 1});
        });
    });

    // UPDATE THE USER
    router.put('/:user_id', function(req, res){
        User.findById(req.params.book_id, function(err, user){
            if(err) return res.status(500).json({ error: 'database failure' });
            if(!user) return res.status(404).json({ error: 'user not found' });

            if(req.body.id) user.title = req.body.id;
            if(req.body.pw) user.author = req.body.pw;
            if(req.body.registed_date) user.published_date = req.body.registed_date;

            user.save(function(err){
                if(err) res.status(500).json({error: 'failed to update'});
                res.json({message: 'user updated'});
            });

        });
    });

    // DELETE USER
    router.delete('/:user_id', function(req, res){
        User.remove({ _id: req.params.user_id }, function(err, output){
            if(err) return res.status(500).json({ error: "database failure" });
            res.status(204).end();
        })
    });
    
    return router;
}