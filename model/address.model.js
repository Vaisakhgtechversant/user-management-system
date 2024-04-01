const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://vaisakhg:lEqDyxySDVok6TSI@ums-db.cvc11dl.mongodb.net/?retryWrites=true&w=majority');

const addressModel = mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usertable',
  },
  address: [{
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    fullName: {
      require: true,
      type: String,
    },
    phoneNumber: {
      require: true,
      type: Number,
    },
    alternateNumber: {
      require: true,
      type: Number,
    },
    Pincode: {
      require: true,
      type: Number,
    },
    state: {
      require: true,
      type: String,
    },
    city: {
      require: true,
      type: String,
    },
    buildingName: {
      require: true,
      type: String,
    },
    area: {
      require: true,
      type: String,
    },
    landMark: {
      require: true,
      type: String,
    },
  }],
});
module.exports = mongoose.model('addresstable', addressModel);
