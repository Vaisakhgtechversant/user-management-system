const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://vaisakhg:lEqDyxySDVok6TSI@ums-db.cvc11dl.mongodb.net/?retryWrites=true&w=majority');

const orderModel = mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usertable',
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'producttable',
    },
    productName: {
      require: true,
      type: String,
    },
    quantity: {
      type: Number,
      default: 1,
    },
  }],
  amount: {
    type: Number,
  },
  address: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
  },
});
module.exports = mongoose.model('ordertable', orderModel);
