const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ums');

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
    title: {
      require: true,
      type: String,
    },
  },
  ],
  isWishlisted: {
    type: Boolean,
    default: true,
  },

});
module.exports = mongoose.model('wishlisttable', wishlistModel);
