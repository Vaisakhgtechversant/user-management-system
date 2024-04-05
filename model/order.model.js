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
    title: {
      require: true,
      type: String,
    },
  }],
  address: [{
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'addresstable',
    },
  },
  ],
  status: {
    type: String,
    default: 'pending',
  },
});
module.exports = mongoose.model('ordertable', orderModel);
