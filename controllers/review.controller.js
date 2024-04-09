const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const ReviewModel = require('../model/review.model');
const userModel = require('../model/user.model');
const reviewSchema = require('../schemas/reviewSchema');
const { handleError } = require('../utils/serverError');

exports.addProductReview = async (req, res) => {
  try {
    const userId = req.decodedId;
    const productId = req.params.id;
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message.replace(/['"]+/g, '');
      return res.status(400).json({
        status: false,
        message: errorMessage,
      });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }
    let reviewData = await ReviewModel.findOne({ userId });
    if (!reviewData) {
      reviewData = new ReviewModel({ userId, reviews: [] });
    }
    reviewData.reviews.push({
      productId,
      rating: req.body.rating,
      comment: req.body.comment,
    });
    await reviewData.save();
    return res.status(200).json({
      status: true,
      message: 'Review added successfully',
    });
  } catch (error) {
    console.log(error);
    return handleError(res);
  }
};

exports.editProductReview = async (req, res) => {
  try {
    const userId = req.decodedId;
    const productId = req.params.id;
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message.replace(/['"]+/g, '');
      return res.status(400).json({
        status: false,
        message: errorMessage,
      });
    }

    const reviewData = await ReviewModel.findOne({ userId });
    console.log(reviewData);
    if (!reviewData) {
      return res.status(404).json({
        status: false,
        message: 'Review data not found',
      });
    }
    const updatedReview = req.body;

    const updateObject = {};
    if (updatedReview.rating !== null && updatedReview.rating !== undefined) {
      updateObject['reviews.$.rating'] = updatedReview.rating;
    }
    if (updatedReview.comment !== null && updatedReview.comment !== undefined) {
      updateObject['reviews.$.comment'] = updatedReview.comment;
    }

    if (Object.keys(updateObject).length > 0) {
      const result = await ReviewModel.updateOne(
        { userId, 'reviews._id': new ObjectId(productId) },
        { $set: updateObject },
      );

      console.log(result);
      if (!result) {
        return res.status(200).json({
          status: true,
          message: 'result not found',
        });
      }
      return res.status(200).json({
        status: true,
        message: 'Review updated successfully',
      });
    }
    return res.status(400).json({
      status: false,
      message: 'No updates were made',
    });
  } catch (error) {
    console.error(error);
    return handleError(res);
  }
};

exports.getReview = async (req, res) => {
  const userId = req.decodedId;
  const productId = req.params.id;
  const pipeline = [
    {
      $match: {
        userId: new ObjectId(userId),
      },
    },
    {
      $unwind: '$reviews',
    },
    {
      $match: {
        'reviews.productId': new ObjectId(productId),
      },
    },
  ];
  const value = await ReviewModel.aggregate(pipeline);
  if (value) {
    res.status(200).json({
      status: true,
      message: 'address retrieved successfully',
      result: value,
    });
  }
};
