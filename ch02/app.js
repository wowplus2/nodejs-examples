const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
var swig = require('swig');

// Inject index controller
var index = require('./controllers/index');
// Inject band controller
var bands = require('./controllers/band');
// Inject user controller
var users = require('./controllers/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));

var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Defining routes and cotrollers functions
app.get('/', index.show);
// bands 목록과 생성에 대한 router 정의
app.get('/bands', bands.list);
app.get('/band/:id', bands.byId);
app.post('/bands', bands.create);
app.put('/band/:id', bands.update);
app.delete('/band/:id', bands.delete);
// users 목록과 생성에 대한 router 정의
app.get('/users', users.list);
app.post('/users', users.create);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
