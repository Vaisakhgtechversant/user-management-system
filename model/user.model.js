const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://vaisakhg:lEqDyxySDVok6TSI@ums-db.cvc11dl.mongodb.net/?retryWrites=true&w=majority');

const userModel = mongoose.Schema({

  id: {
    require: true,
    type: String,
  },
  firstName: {
    require: true,
    type: String,
  },
  lastName: {
    require: true,
    type: String,
  },
  email: {
    require: true,
    type: String,
  },
  image: {
    type: Buffer,
  },
  otp: {
    require: false,
    type: String,
  },
  password: {
    require: true,
    type: String,
  },
  role: {
    require: true,
    type: String,
  },
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'producttable', // Reference to the Product model
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
    image: {
      type: Buffer,
    },
  }],
  wishlist: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'producttable', // Reference to the Product model
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
    availability: {
      type: String,
    },
    productCode: {
      type: Number,
    },
    image: {
      type: Buffer,
    },
  }],
});
module.exports = mongoose.model('usertable', userModel);
