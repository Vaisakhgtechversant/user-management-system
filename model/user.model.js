const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ums');

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
  password: {
    require: true,
    type: String,
  },
  role: {
    require: true,
    type: String,
  },
});
module.exports = mongoose.model('usertable', userModel);
