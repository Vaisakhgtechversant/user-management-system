const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ums');

const orderModel = mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usertable',
  },
  products: {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    title: {
      require: true,
      type: String,
    },
  },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  status: {
    type: String,
    default: 'pending',
  },
  orderConfirmed: {
    type: Date,
    default: Date.now,
  },
  delivered: {
    type: Date,
    default: null,
  },
});
module.exports = mongoose.model('ordertable', orderModel);
