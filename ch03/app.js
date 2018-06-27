require('dotenv').config();
// Import basic modules
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// import multer
const multer = require('multer');
const upload = multer({
	dest: './public/uploads/',
	limits: { fileSize: 1000000, files: 1 }
});

// import home controller
const index = require('./server/controllers/index');
// import login controller
const auth = require('./server/controllers/auth');
// import comments controller
const comments = require('./server/controllers/comments');
// import video controller
const videos = require('./server/controllers/videos');
// import image controller
const imgs = require('./server/controllers/images');

// ODM with mongoose
const mongoose = require('mongoose');
// session 저장용 모듈
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
// import passport & flash message module
const passport = require('passport');
const flash = require('connect-flash');

// app 변수로 express application 시작
const app = express();

// view 엔진 setting
app.set('views', path.join(__dirname, 'server/views/pages'));
app.set('view engine', 'ejs');

// db setting
const config = require('./server/config/config.js');
// db connect
mongoose.connect(config.url);
// mongodb 실행 체크
mongoose.connection.on('error', () => {
	console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});
// passport setting
require('./server/config/passport')(passport);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
	require('node-sass-middleware')({
		src: path.join(__dirname, 'public'),
		dest: path.join(__dirname, 'public'),
		indentedSyntax: true,
		sourceMap: true
	})
);
// public directory setting
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
// 세션용 secret key setting
app.use(
	session({
		secret: process.env.AUTH0_CLIENT_SECRET,
		saveUninitialized: true,
		resave: true,
		//store session on MongoDB using express-session + connect mongo
		store: new MongoStore({
			url: config.url,
			collection: 'sessions'
		})
	})
);
// passport 인증 초기화
app.use(passport.initialize());
// 영구적인 로그인 세션
app.use(passport.session());
// flash message
app.use(flash());

// Application Routes
app.get('/', index.show);
app.get('/signin', auth.signin);
app.post(
	'/signin',
	passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/signin',
		failureFlash: true
	})
);
app.get('/profile', auth.isLoggedIn, auth.profile);
app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

// comments routes
app.get('/comments', comments.hasAuthorization, comments.list);
app.post('/comments', comments.hasAuthorization, comments.create);
// videos routes
app.get('/videos', videos.hasAuthorization, videos.show);
app.post(
	'/videos',
	videos.hasAuthorization,
	upload.single('video'),
	videos.uploadVideo
);
// images routes
app.post(
	'/images',
	images.hasAuthorization,
	upload.single('image'),
	images.uuploadImage
);
app.get('/gallery', images.hasAuthorization, images.show);

// 404 error 발생 시 에러핸들러로 전송
app.use((req, res, next) => {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use((err, req, res, next) => {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// product 환경에서는 사용자에게 에러 메세지를 보여주지 않는다.
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;

app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), () => {
	console.log('Express server listening on port ' + server.address().port());
});
