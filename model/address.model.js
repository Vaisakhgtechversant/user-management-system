const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ums');

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
    pincode: {
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
    landmark: {
      require: true,
      type: String,
    },
  }],
});
module.exports = mongoose.model('addresstable', addressModel);
