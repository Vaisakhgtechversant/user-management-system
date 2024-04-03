const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://vaisakhg:lEqDyxySDVok6TSI@ums-db.cvc11dl.mongodb.net/?retryWrites=true&w=majority');

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
    amount: {
      type: Number,
    },
  }],
});
module.exports = mongoose.model('carttable', cartModel);
