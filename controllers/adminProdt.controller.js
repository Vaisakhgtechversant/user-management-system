const productModel = require('../model/products.model');
const productSchema = require('../schemas/products.schemas');

exports.addProduct = async (req, res) => {
  try {
    const { error } = productSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message.replace(/['"]+/g, '');
      return res.status(400).json({
        status: false,
        message: errorMessage,
      });
    }
    const imageBuffer = req.file.buffer;
    const {
      productName, productPrice, productDetails,
      category, availability, productCode, quantity, role,
    } = req.body;
    await productModel.create({
      productName,
      productPrice,
      productDetails,
      category,
      availability,
      productCode,
      quantity,
      role,
      image: imageBuffer,
    });
    return res.status(201).json({
      status: 'true',
      message: 'registration successful',
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'internal server error',
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const result = await productModel.find();
    if (result) {
      res.status(400).json({
        status: true,
        data: result,
      });
    } else {
      res.status(400).json({
        status: false,
        message: 'not found',
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      message: 'internal server error',
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateUser = req.body;
    const { error } = productSchema.validate(updateUser);
    if (error) {
      const errorMessage = error.details[0].message.replace(/['"]+/g, '');
      return res.status(400).json({
        status: false,
        message: errorMessage,
      });
    }
    const result = await productModel.updateOne({ _id: userId }, { $set: updateUser });
    if (result) {
      return res.status(200).json({
        status: true,
        message: 'updated success',
        data: result,
      });
    }
    return res.status(200).json({
      status: false,
      message: 'data not found',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: 'internal server error',
    });
  }
};
