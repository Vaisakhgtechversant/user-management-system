const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://vaisakhg:lEqDyxySDVok6TSI@ums-db.cvc11dl.mongodb.net/?retryWrites=true&w=majority');

const orderModel = mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usertable', // Reference to the User model
    required: true,
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'producttable', // Reference to the Product model
      required: true,
    },
    productName: {
      type: String,
    },
    productPrice: {
      type: String,
    },
    productDetails: {
      type: String,
    },
    category: {
      type: String,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    availability: {
      type: String,
    },
    productCode: {
      type: Number,
    },
  }],
  orderDate: {
    type: Date,
    default: Date.now,
  },
  totalPrice: {
    type: Number,
  },
  billingAddress: {
    type: String,
  },
  shippingAdderss: {
    type: String,
  },
});
module.exports = mongoose.model('ordertable', orderModel);
