var express    = require('express');
    app        = express();
    bodyParser = require('body-parser');
    session    = require('express-session');
    bcrypt     = require('bcrypt-nodejs');

app.set('views', __dirname + '/view');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: 'ambc@!vsmkv#!&*!#EDNAnsv#!$()_*#@',
    resave: false,
    saveUninitialized: true
}));

const users = [
    {
        user_id: 'hyeok',
        user_nickname: '혁',
        user_pwd: '123456'
    },
    {
        user_id: 'hyc7575',
        user_nickname: '에이치',
        user_pwd: '1q2w3e4r'
    }
]

// 사용자가 입력한 ID, PW가 데이터베이스에 저장되어 있는지 검사하여 true/false를 반환하는 함수
function isRegistered(user_id, user_pwd) {
    return users.find( v => (v.user_id === user_id &&  bcrypt.compareSync(user_pwd, v.user_pwd) ) );
}
// 해당 사용자의 고유한 Index(session.sid)를 반환하는 함수
function getUserIndex(user_id, user_pwd) {
 
    return users.findIndex( v => (v.user_id === user_id && bcrypt.compareSync(user_pwd, v.user_pwd)) );
}

app.get('/', (req, res) => {
    const sess = req.session;
    res.render('index', {
        nickname: sess.user_uid+1 ? users[sess.user_uid]['user_nickname'] : ''
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', (req, res) => {
    const body = req.body;
    if(isRegistered( body.user_id, body.user_pwd)) {
        req.session.user_uid = getUserIndex(body.user_id, body.user_pwd);
        res.redirect('/');
    } else {
        res.send('유효하지 않습니다.');
    }
});

app.get('/logout', (req, res) => {
    delete req.session.user_uid;
    res.redirect('/');
});

app.get('/join', (req, res) => {
    res.render('join');
});
app.post('/join', (req, res) => {
    const body = req.body;
    if(!isRegistered(body.user_id, body.user_pwd)) { // 동일한 아이디가 존재하는지 검사하는 함수 필요
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(body.user_pwd, salt);
        users.push({
            user_id: body.user_id,
            user_pwd: hash,
            user_nickname: body.user_nickname
        });
    	res.redirect('/login');
    } else {
    	res.send('이미 존재함');
    }
});

app.listen(7777);
console.log('server port 7777 listned');