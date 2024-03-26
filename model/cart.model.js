const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://vaisakhg:lEqDyxySDVok6TSI@ums-db.cvc11dl.mongodb.net/?retryWrites=true&w=majority');

const cartModel = mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usertable',
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'producttable',
  },
  id: {
    require: true,
    type: String,
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
  quantity: {
    type: Number,
    default: 1,
  },
  stock: {
    require: true,
    type: String,
  },
  image: {
    type: Buffer,
  },
  role: {
    require: true,
    type: String,
  },
});
module.exports = mongoose.model('carttable', cartModel);
