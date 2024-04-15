const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ums');

const reviewModel = mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usertable',
  },
  reviews: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'producttable',
    },
    rating: {
      type: Number,
    },
    comment: {
      type: String,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('reviewtable', reviewModel);
