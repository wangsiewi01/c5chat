var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var users = {};//存储在线用户列表的对象

app.get('/', function (req, res) {
    if (req.cookies.user == null) {
        res.redirect('/signin');
    } else {
        res.render('index');
    }
});
app.get('/signin', function (req, res) {
    res.render('signin');
});
app.post('/signin', function (req, res) {
    if (users[req.body.name]) {
        //存在，则不允许登陆
        res.redirect('/signin');
    } else {
        //不存在，把用户名存入 cookie 并跳转到主页
        res.cookie("user", req.body.name, {maxAge: 1000 * 60 * 60 * 24 * 30});
        res.redirect('/');
    }
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
module.exports.users = users;
