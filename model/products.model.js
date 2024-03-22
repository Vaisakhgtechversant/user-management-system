const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://vaisakhg:lEqDyxySDVok6TSI@ums-db.cvc11dl.mongodb.net/?retryWrites=true&w=majority');

const productModel = mongoose.Schema({

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
    require: false,
    type: String,
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
module.exports = mongoose.model('producttable', productModel);
