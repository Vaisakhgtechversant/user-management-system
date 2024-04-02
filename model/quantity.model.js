const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://vaisakhg:lEqDyxySDVok6TSI@ums-db.cvc11dl.mongodb.net/?retryWrites=true&w=majority');

const quantityModel = mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usertable',
  },
  quantity: {
    type: Number,
    default: 1,
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
});
module.exports = mongoose.model('quantitytable', quantityModel);
