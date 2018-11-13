// [EXPRESS CONFIG]
var express     = require('express');
    app         = express();
    bodyParser  = require('body-parser');
    session     = require('express-session');
    mongoose    = require('mongoose');

// [APP CONFIG]
app.set('views', __dirname + '/view');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: 'ambc@!vsmkv#!&*!#EDNAnsv#!$()_*#@',
    resave: false,
    saveUninitialized: true
}));

// [DB CONFIG]
// DB CONNECTION
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log("Connected to mongod server");
});
var conn = mongoose.connect('mongodb://localhost/db', { useNewUrlParser: true });

// [VIEW ROUTER]
var route = require('./login');
app.use('/',route)


// [RUN SERVER]
var server = app.listen(7777, function(){
    console.log("Express server has started on port 7777");
});