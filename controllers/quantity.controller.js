const quantityModel = require('../model/quantity.model');
const userModel = require('../model/user.model');
const { handleError } = require('../utils/serverError');
const quantitySchema = require('../schemas/quantitySchema');

exports.add_qty = async (req, res) => {
  try {
    const userId = req.decodedId;
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
    const {
      quantity,
    } = req.body;
    await quantityModel.create({
      quantity,
    });
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
