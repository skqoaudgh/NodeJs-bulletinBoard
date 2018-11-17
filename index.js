// [EXPRESS CONFIG]
var express     = require('express');
    app         = express();
    bodyParser  = require('body-parser');
    session     = require('express-session');
    mongoose    = require('mongoose');
    //formidable = require('express-formidable');

// [APP CONFIG]
app.set('view engine', 'ejs');
app.set('views', __dirname + '/view');
app.use("/view",express.static(__dirname + "/view"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/*
app.use(formidable({
    encoding: 'utf-8',
    multiples: true,
  }));
*/

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
var login_route = require('./login');
app.use('/',login_route);

var main_route = require('./main/routes');
app.use('/main',main_route);

// [RUN SERVER]
var server = app.listen(7777, function(){
    console.log("Express server has started on port 7777");
});