const quantityModel = require('../model/quantity.model');
const userModel = require('../model/user.model');
const ProductModel = require('../model/products.model');
const { handleError } = require('../utils/serverError');
const quantitySchema = require('../schemas/quantitySchema');

exports.add_qty = async (req, res) => {
  try {
    const userId = req.decodedId;
    const productId = req.params;

    const { error } = quantitySchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }
    const product = await ProductModel.findById(productId);
    console.log('product', product);
    if (!product) {
      return res.status(404).json({
        status: false,
        message: 'Product not found',
      });
    }
    let productItem = await ProductModel.findOne({ userId });
    console.log('wishlistItem', ProductModel);
    // If wishlistItem doesn't exist, create a new one
    if (!productItem) {
      productItem = new ProductModel({
        userId,
        quantity,
      });
    }
    return res.status(201).json({
      status: 'true',
      message: 'quantity changed',
    });
  } catch (error) {
    return handleError(res);
  }
};

exports.get_quantity = async (req, res) => {
  try {
    const userId = req.decodedId;
    const data = await quantityModel.findOne({ userId });
    if (data) {
      return res.status(200).json({
        status: true,
        message: 'user retrieved successfully',
        result: data,
      });
    }
    return res.status(404).json({
      status: false,
      message: 'user not found',
    });
  } catch (error) {
    return handleError(res);
  }
};

exports.edit_quantity = async (req, res) => {
  const userId = req.decodedId;
  const updateQuantity = req.body;
  const { error } = quantitySchema.validate(updateQuantity);
  if (error) {
    const errorMessage = error.details[0].message.replace(/['"]+/g, '');
    return res.status(400).json({
      status: false,
      message: errorMessage,
    });
  }
};
