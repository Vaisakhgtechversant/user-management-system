const OrderModel = require('../model/order.model');
const userModel = require('../model/user.model');
const cartModel = require('../model/cart.model');
const addressModel = require('../model/address.model');

// const productModel = require('../model/products.model');
const { handleError } = require('../utils/serverError');

exports.orderProduct = async (req, res) => {
  try {
    const userId = req.decodedId;

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
    if (!cartItems || cartItems.products.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'No products found in the cart',
      });
    }
    const amount = cartItems.products.reduce((acc, product) => {
      if (product.price && product
        .quantity && !Number.isNaN(product.price) && !Number.isNaN(product.quantity)) {
        return acc + (parseFloat(product.price) * parseFloat(product.quantity));
      }
      console.error('Invalid product price or quantity:', product);
      return acc;
    }, 0);

    const order = new OrderModel({
      userId,
      products: cartItems.products,
      address: address.address,
      amount,
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

exports.get_order = async (req, res) => {
  try {
    const userId = req.decodedId;
    const user = await userModel.findOne({ userId });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }
    const orders = await OrderModel.findOne({ userId });
    if (orders) {
      return res.status(200).json({
        status: true,
        message: 'Orders retrieved successfully',
        result: orders,
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
