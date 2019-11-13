/* eslint-disable no-var */

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cors = require('cors');
var app = express();
// set view engine
app.set('view engine', 'jade');
// logs
app.use(logger('dev'));
// json body parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// cookie parser
app.use(cookieParser());
// making the public folder accessible to access the static items.
app.use(express.static(path.join(__dirname, 'public')));
// use express session  to maintain the authentication status
/* app.use(require('express-session')(
  { secret: 'keyboard cat',
   resave: false,
   saveUninitialized: false,
   cookie: { expires: 60000 }
   }))
*/
// passport intialize middleware
app.use(passport.initialize());
app.use(passport.session());
// routes for authentication
app.use('/', indexRouter);
app.use('/users', usersRouter);

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
