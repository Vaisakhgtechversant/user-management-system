const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ums');

const productModel = mongoose.Schema({

  id: {
    require: true,
    type: String,
  },
  title: {
    require: true,
    type: String,
  },
  description: {
    require: true,
    type: String,
  },
  category: {
    require: true,
    type: String,
  },
  size: {
    type: String,
  },
  color: {
    type: String,
  },
  availability: {
    require: true,
    type: String,
  },
  stock: {
    require: true,
    type: Number,
  },
  image: [{
    type: Buffer,
  }],
  price: {
    type: Number,
    required: true,
  },
  offer: {
    type: Number,
    min: 0,
    max: 100,
  },
  discountedPrice: {
    type: Number,
  },

});
module.exports = mongoose.model('producttable', productModel);
