const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ums');

const cartModel = mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usertable',
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'producttable',
    },
    title: {
      require: true,
      type: String,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
    },
  }],
});
module.exports = mongoose.model('carttable', cartModel);
