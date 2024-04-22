const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
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
    console.log('req.files', req.files);

    const images = req.files;

    const imageBuffers = images.map((image) => image.buffer);
    const {
      title, description,
      category, size, color, availability,
      stock, price, offer,
    } = req.body;
    const discountedPrice = price - (price * (offer / 100));
    const productData = {
      title,
      description,
      category,
      size,
      color,
      availability,
      stock,
      price,
      offer,
      discountedPrice,
      image: imageBuffers,
    };
    await productModel.create(productData);
    console.log(productData);
    return res.status(201).json({
      status: 'true',
      message: 'product added successful',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'internal server error',
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { category: { $regex: new RegExp(search, 'i') } },
          { productName: { $regex: new RegExp(search, 'i') } },
        ],
      };
    }
    const currentPage = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const startIndex = (currentPage - 1) * limitNumber;
    const totalCount = await productModel.countDocuments(query);
    const paginatedData = await productModel.find(query).skip(startIndex).limit(limitNumber);
    // const result = await productModel.find();
    res.status(200).json({
      status: true,
      message: 'Users data retrieved successfully',
      currentPage,
      limit: limitNumber,
      totalCount,
      products: paginatedData,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'internal server error',
    });
  }
};

exports.singleProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = await productModel.findOne({ _id: productId });
    if (data) {
      return res.status(200).json({
        status: true,
        messsage: 'data retrived success',
        result: data,
      });
    }
    return res.status(404).json({
      status: false,
      message: 'data not found',
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'internal server error',
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const userId = req.decodedId;
    const productId = req.params;

    const { error } = productSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message.replace(/['"]+/g, '');
      return res.status(400).json({
        status: false,
        message: errorMessage,
      });
    }
    const images = req.files;
    const imageBuffers = images.map((image) => image.buffer);
    const updateUser = req.body;
    if (imageBuffers.length !== 0) {
      updateUser.image = imageBuffers;
    }
    const updateObject = {};
    if (updateUser.image !== null && updateUser.image !== undefined) {
      updateObject['$.image'] = updateUser.image;
    }
    const result = await productModel
      .updateOne({ _id: userId, _id: new ObjectId(productId) }, { $set: updateUser });
    console.log(result);
    if (result) {
      return res.status(200).json({
        status: true,
        message: 'product updated Successfully',
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

exports.deleteProducts = async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await productModel.deleteOne({ _id: productId });
    if (result) {
      res.status(200).json({
        status: true,
        message: 'product deleted',
      });
    } else {
      res.status(400).json({
        status: false,
        message: 'product not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'internal server error',
    });
  }
};
