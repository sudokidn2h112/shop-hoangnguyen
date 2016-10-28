var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Product = require('../models/product');
var Order = require('../models/order');
var Cart = require('../models/cart');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET users listing. */
router.get('/profile', isLoggedIn, function (req, res, next) {
  Order.find({user: req.user}, function (err, orders) {
    if(err){
      return res.write('Error!');
    }
    var cart;
    orders.forEach(function (order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
  res.render('user/profile', {title: 'Profile',orders: orders});
  });
});
router.get('/logout', isLoggedIn, function (req, res, next) {
  req.logout();
  res.redirect('/');
});

router.use('/', notLoggedIn, function (req, res, next) {
  next();
});
router.get('/signup', function(req, res, next){
  var messages = req.flash('error');
  res.render('user/signup', {title: 'Sign Up' , csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length >0});
});
router.post('/signup', passport.authenticate('local.signup', {
  failureRedirect : '/user/signup',
  failureFlash : true
}), function (req, res, next) {
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  }else {
    res.redirect('/user/profile');
  }
});
router.get('/signin', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', {title: 'Sign In', csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length >0});
});

router.post('/signin', passport.authenticate('local.signin', {
  failureRedirect : '/user/signin',
  failureFlash : true
}),function (req, res, next) {
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  }else {
    res.redirect('/user/profile');
  }
});

//Add Admin Advertisement
router.get('/admin', function (req, res, next) {

  res.render('user/admin', {title: 'Admin Page',arr :arrAdv});
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

module.exports = router;
function isLoggedIn(req, res, next)  {
  if(req.isAuthenticated()){
    return next();
  }
    res.redirect('/');
}

function notLoggedIn(req, res, next)  {
  if(!req.isAuthenticated()){
    return next();
  }
    res.redirect('/');
}

// function isLoggedInAd(req, res, next) {
//   if(req.isAuthenticated()){
//     return next();
//   }
//     res.redirect('/user/sigin');
// }
