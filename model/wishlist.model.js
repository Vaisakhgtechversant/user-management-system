const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://vaisakhg:lEqDyxySDVok6TSI@ums-db.cvc11dl.mongodb.net/?retryWrites=true&w=majority');

const wishlistModel = mongoose.Schema({

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
    productPrice: {
      require: true,
      type: String,
    },
    productDetails: {
      require: true,
      type: String,
    },
    category: {
      require: true,
      type: String,
    },
    availability: {
      require: true,
      type: String,
    },
    productCode: {
      require: true,
      type: String,
    },
    stock: {
      require: true,
      type: String,
    },
    image: {
      type: Buffer,
    },
  },
  ],
  id: {
    require: true,
    type: String,
  },
  role: {
    require: true,
    type: String,
  },
});
module.exports = mongoose.model('wishlisttable', wishlistModel);
