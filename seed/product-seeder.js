var Product = require('../models/product');

var mongoose = require('mongoose');
mongoose.connect('127.0.0.1:27017/shopping');

var products = [
 new Product({
  imagePath:'https://i.ytimg.com/vi/_CuyHrhWGto/maxresdefault.jpg',
  title:'Iphone 7',
  description:'Iphone 7 màu hồng sành điệu ^^',
  price: 649
}),
new Product({
imagePath:'http://www.hnammobile.com//uploads/products/colors/1/samsung-galaxy-note-7-8189585861-jpg.jpg',
title:'Galaxy Note 7',
description:'Phong cách hoàn toàn mới với màn hình cong và chống nước',
price: 669
}),
new Product({
imagePath:'http://www.thegioiblackberry.vn/uploads/gallerys/BlackBerry-Classic-_q20.jpg',
title:'BlackBerry-Classic',
description:'Phong cách xưa pha lẫn hiện đại với bàn phím cảm ứng',
price: 112
}), new Product({
  imagePath:'http://didongthongminh.vn/images/products/2016/07/15/original/oppo-a37-1-1_1468596493.jpg',
  title:'Oppo Neo 9',
  description:'Sự vươn mình của Oppo',
  price: 101
}),
new Product({
imagePath:'https://i.ytimg.com/vi/55inX211Og8/maxresdefault.jpg',
title:'PS4 NEO',
description:'Đầu chơi các game và đồ họa khủng cho gamer',
price: 69
}),
new Product({
imagePath:'https://i.ytimg.com/vi/4ZBDqOkG7ek/maxresdefault.jpg',
title:'MacBook Pro',
description:'MacBook Pro 2016 thiết kế ấn tượng, cấu hình khủng',
price: 1112
})
];

var done = 0;
for(var i = 0; i< products.length; i++){
  products[i].save(function (err, result) {
    done++;
    if(done === products.length) {
      exit();
  }
  });
}
function exit() {
  mongoose.disconnect();
}
