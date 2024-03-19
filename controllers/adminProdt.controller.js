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
    let imageBuffer = null;
    if (req.file) {
      imageBuffer = req.file.buffer;
    }
    const {
      productName, productPrice, productDetails,
      category, availability, productCode, quantity,
    } = req.body;
    const productData = {
      productName,
      productPrice,
      productDetails,
      category,
      availability,
      productCode,
      quantity,
    };
    if (imageBuffer) {
      productData.image = imageBuffer;
    }
    await productModel.create(productData);
    return res.status(201).json({
      status: 'true',
      message: 'product added successful',
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
    const { page, limit, search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { firstName: { $regex: new RegExp(search, 'i') } },
          { lastName: { $regex: new RegExp(search, 'i') } },
          { email: { $regex: new RegExp(search, 'i') } },
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
        message: 'product updated Successfully',
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

exports.deleteProducts = async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await productModel.deleteOne({ _id: productId });
    if (result) {
      res.status(200).json({
        status: true,
        message: 'rpoduct deleted',
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
