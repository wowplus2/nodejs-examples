const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');

const rootRouter = require('./server/routes/index');
const usersRouter = require('./server/routes/users');
const comments = require('./server/controllers/comments');

// 몽구스 ODM
const mongoose = require('mongoose');
// 세션 저장용 모듈
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
// Passport와 경고 플래시 메세지 모듈 가져오기
const passport = require('passport');
const flash = require('connect-flash');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'server/views/pages'));
app.set('view engine', 'ejs');

// 데이터베이스 설정
const conf = require('./server/config/config.js');
// 데이터베이스 연결
mongoose.connect(conf.url);
// 데이터베이스 연결 체크
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});
// Passport 설정
require('./server/config/passport')(passport);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
  })
);
app.use(express.static(path.join(__dirname, 'public')));

// Passport
// 세션용 Secret Key
app.use(
  session({
    secret: 'sometext_go_here',
    saveUninitialized: true,
    resave: true,
    // express-session과 connect-mongo를 이용해 MongoDB에 session 저장
    store: new MongoStore({
      url: conf.url,
      collection: 'sessions'
    })
  })
);
// Passport 인증 초기화
app.use(passport.initialize());
// 영구적인 로그인 session
app.use(passport.session());
// flash message
app.use(flash());

app.use('/', rootRouter);
app.use('/users', usersRouter);

app.get('/comments', comments.hasAuthorization, comments.list);
app.post('/comments', comments.hasAuthorization, comments.create);

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  next(createError(404));
//});
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + server.address().port);
});
