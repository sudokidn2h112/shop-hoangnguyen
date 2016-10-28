var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require("express-handlebars");
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStrore = require('connect-mongo')(session);

var routes = require('./routes/index');
var userRoutes = require('./routes/user');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
// var port = process.env.PORT || 3000;
// server.listen(port, function (err) {
//   if(err){
//     console.log('Server start error: '+err);
//   }else {
//     console.log('Server is running at port: '+port);
//   }
// });

//set env vars
// process.env.MONGOLAB_URI = process.env.MONGOLAB_URI || 'mongodb://localhost/shopping-cart';
// process.env.PORT = process.env.PORT || 3000;

// connect our DB
mongoose.connect('mongodb://shopping-cart:langtutm1411@ds053166.mlab.com:53166/shopping-cart-hoangnguyen');
// mongoose.connect('127.0.0.1:27017/shopping');
// var connectionUrl = (process.env.NODE_ENV == 'production') ? 'mongodb://shopping-cart:langtutm1411@ds053166.mlab.com:53166/shopping-cart-hoangnguyen':'localhost:27017/shopping';
// console.log(connectionUrl);
// console.log(process.env.NODE_ENV);
// console.log(process.env.PORT);
// console.log(process.env.IP);
// mongoose.connect(connectionUrl, function (err) {
//   var db = mongoose.connection;
//   if(err){
//     console.log("Connect Mongoose Err! " +err);
//     db.on('error', function(err){
//       console.log('Connect Mongoose Error! :' +err);
//     });
//   }
//     db.once('open', function (cb) {
//       console.log('Connect Mongoose Success!');
//     });
//
// });
require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStrore({mongooseConnection: mongoose.connection}),
  cookie: {maxAge: 180*60*100}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

app.use('/user', userRoutes);

app.use('/', routes);
// using socket.io for route admin to advertisement
io.on('connection', function (socket) {
  console.log("Have user connected with id: " +socket.id);
  socket.on('admin-send-data', function cb(data) {
    var linh = searchLink(data);
      io.sockets.emit('server-send-data', {hinh: data, link: linh});


  });
});

var arrAdv = [
  new Advertisement ("bb-q20.jpg", "http://mobigo.vn"),
  new Advertisement ("ip-7.jpg", "http://www.apple.com/shop/buy-iphone/iphone-7"),
  new Advertisement ("mi-m5.jpg", "http://www.mi.com/en/"),
  new Advertisement ("note-7.jpg", "http://www.samsung.com/global/galaxy/"),
  new Advertisement ("httc-one9.png", "http://www.htc.com/vn/smartphones/htc-one-e9-dual-sim/"),
  new Advertisement ("ip-6s.jpg", "http://www.apple.com/shop/buy-iphone/iphone6s"),
  new Advertisement ("ong-tho.jpg", "http://tapchidanba.com/tang-can-nhanh-voi-sua-ong-tho-tin2963.html"),
  new Advertisement ("oppo-f1.jpg", "http://www.oppo.com/en/smartphones/"),
  new Advertisement ("tgdd.jpg", "https://www.thegioididong.com/"),
  new Advertisement ("tinhte.jpg", "https://tinhte.vn/")
];

function Advertisement(img, link) {
  this.Img = img;
  this.Link = link;
};

function searchLink(hinh) {
  var kq = "";
  arrAdv.forEach (function (adv) {
    if(adv.Img == hinh){
      kq = adv.Link;
    }
  });
  return kq;
};

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
