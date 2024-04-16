const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const OrderModel = require('../model/order.model');
const userModel = require('../model/user.model');
const cartModel = require('../model/cart.model');
const addressModel = require('../model/address.model');
const productModel = require('../model/products.model');

// const productModel = require('../model/products.model');
const { handleError } = require('../utils/serverError');

exports.orderProduct = async (req, res) => {
  try {
    const userId = req.decodedId;
    const { addressId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }
    const address = await addressModel.findOne({ userId });
    if (!address) {
      return res.status(404).json({
        status: false,
        message: 'Address not found for the user',
      });
    }
    const cartItems = await cartModel.findOne({ userId });
    console.log('cartItems', cartItems);
    if (!cartItems || cartItems.products.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'No products found in the cart',
      });
    }

    cartItems.products.forEach(async (element) => {
      const order = new OrderModel({
        userId,
        products: element,
        addressId,
      });

      await order.save();
    });
    await cartModel.findOneAndDelete({ userId });
    return res.status(201).json({
      status: true,
      message: 'Order done',
    });
  } catch (error) {
    console.log(error);
    return handleError(res);
  }
};
exports.orderSingleProduct = async (req, res) => {
  try {
    const userId = req.decodedId;
    const productId = req.params.id;
    console.log('productId', productId);
    const { addressId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }
    const address = await addressModel.findOne({ userId });
    if (!address) {
      return res.status(404).json({
        status: false,
        message: 'Address not found for the user',
      });
    }
    const singleProduct = await productModel.findById(productId);
    console.log('singleProduct', singleProduct);

    const order = new OrderModel({
      userId,
      products: { productId: singleProduct._id, title: singleProduct.title },
      addressId,
    });
    await order.save();
    return res.status(201).json({
      status: true,
      message: 'Order done',
    });
  } catch (error) {
    console.log(error);
    return handleError(res);
  }
};

exports.my_order_single = async (req, res) => {
  try {
    const userId = req.decodedId;
    const productId = req.params;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }
    const pipeline = [
      {
        $match: {
          userId: new ObjectId(
            userId,
          ),
        },
      },
      {
        $lookup: {
          from: 'producttables',
          localField: 'products.productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      {
        $match: {
          'product._id': new ObjectId(
            productId,
          ),
        },
      },
      {
        $lookup: {
          from: 'addresstables',
          localField: 'userId',
          foreignField: 'userId',
          as: 'addressData',
        },
      },
      {
        $unwind: '$addressData',
      },
      {
        $project: {
          matchedAddress: {
            $filter: {
              input: '$addressData.address',
              as: 'addressElem',
              cond: {
                $eq: [
                  '$$addressElem._id',
                  '$addressId',
                ],
              },
            },
          },
          product: 1,
          userId: 1,
          status: 1,
          orderConfirmed: {
            $dateToString: {
              format: '%d-%b-%Y',
              date: '$orderConfirmed',
            },
          },
        },
      },
      { $unwind: '$matchedAddress' },
    ];
    const data = await OrderModel.aggregate(pipeline);
    console.log('data', data);
    if (data) {
      return res.status(200).json({
        status: true,
        message: 'data retrived ',
        results: data,
      });
    }
    return res.status(404).json({
      status: false,
      message: 'No orders found for the user',
    });
  } catch (error) {
    console.log(error);
    return handleError(res);
  }
};

exports.order_product_list = async (req, res) => {
  try {
    const userId = req.decodedId;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }
    const pipeline = [
      {
        $match: {
          userId: new ObjectId(
            userId,
          ),
        },
      },
      {
        $lookup: {
          from: 'producttables',
          localField: 'products.productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },

      {
        $project: {
          userId: 1,
          product: 1,
          status: 1,
        },
      },
    ];
    const data = await OrderModel.aggregate(pipeline);
    if (data) {
      return res.status(200).json({
        status: true,
        message: 'data retrived successfully',
        results: data,
      });
    }
    return res.status(404).json({
      status: false,
      message: 'No orders found for the user',
    });
  } catch (error) {
    console.log(error);
    return handleError(res);
  }
};
