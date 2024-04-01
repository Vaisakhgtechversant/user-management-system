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
