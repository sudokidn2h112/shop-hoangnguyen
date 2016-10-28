var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function(err, docs){
    var productChunks = [];
    var chunkSize = 3;
    for(var i=0; i < docs.length; i += chunkSize){
      productChunks.push(docs.slice(i, i+chunkSize));
    }
    res.render('shop/index', { title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessage: !successMsg});
  });
});

router.get('/add-to-cart/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function (err, product) {
      if(err){
        res.redirect('/');
      }
      cart.add(product, product.id);
      req.session.cart = cart;
      console.log(req.session.cart);
      res.redirect('/');
    });
});

router.get('/reduce/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/remove/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});


router.get('/shopping-cart', function (req, res, next) {
  if(!req.session.cart){
    return res.render('shop/shopping-cart', {title: 'Item In Cart',products:null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {title: 'Item In Cart',products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', isLoggedIn ,function (req, res, next) {
  if(!req.session.cart){
  return res.render('shop/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', { title: 'Checkout Buy Item', total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, function (req, res, next) {
  if(!req.session.cart){
  res.render('shop/shopping-cart', { title: 'Checkout Buy Item' });
  }
  var cart = new Cart(req.session.cart);
// email and pass in stripe.com : hailuaitf09t2@gmail.com - pass: hoangnhai
  var stripe = require("stripe")(
    "sk_test_MZG1O34M9pw56fiOi5pXBI7J"
  );

  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Test Charge"
  }, function(err, charge) {
    if(err){
      req.flash('Erorr', err.message);
      return res.redirect('/checkout');
    }
    var order = new Order({
      user: req.user,
      cart: cart,
      name: req.body.name,
      address: req.body.address,
      paymentId: charge.id
    });
    order.save(function (err, result) {
      req.flash('success', 'Successfully bought product!');
      req.session.cart = null;
      res.redirect('/');
    });
  });
});
module.exports = router;

function isLoggedIn(req, res, next)  {
  if(req.isAuthenticated()){
    return next();
  }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
