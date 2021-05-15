// SharpJS Image Processing Server
//  Built using Sharpjs library
//  Coded By: Brent Willems (2021-05)

// Default Express Import variables
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Additional Imports
const fs = require('fs') // Server Filesystem handling
const bodyParser = require('body-parser') // handling POST body
const multer = require('multer')  //handling file uploads

// Local Server Processing imports
const resize = require('./processing/sharp.js')
const fileNames = require('./processing/fileNames.js')

// Configurations
let upload = multer({dest: 'temp/'}) // Multer configuration


// Router variables
var indexRouter = require('./routes/index');
const apiRouter = require('./routes/api')

// The Express server app
var app = express();

// view engine setup (not necessary
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: false}));  //required for handling post requests

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Handle Options request when posting
// from: http://johnzhang.io/options-request-in-express
app.options("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.sendStatus(200);
});

// Allow all requests to server (to remove CORS Policy error)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Server Index page (informative only)
app.use('/', indexRouter)

// API router (actual server functionality)
app.use('/api/', apiRouter)




// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
