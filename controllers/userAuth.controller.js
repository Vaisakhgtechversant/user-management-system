const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const dotenv = require('dotenv');
const userModel = require('../model/user.model');
const userRegistrationSchema = require('../schemas/userRegistration.schema');
const userUpdateSchema = require('../schemas/userupdate.schema');
const updatePassword = require('../schemas/updatePassword.schema');
const { handleError } = require('../utils/serverError');
const productModel = require('../model/products.model');
const orderModel = require('../model/order.model');
const CartItem = require('../model/cart.model');
const WishlistItem = require('../model/wishlist.model');

dotenv.config();
const { envtoken } = process.env;
let newOtp = null;
exports.addNewUser = async (req, res) => {
  try {
    const { error } = userRegistrationSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({
        status: false,
        message: 'Email already exists',
      });
    }
    const {
      firstName, lastName, email, password, role,
    } = req.body;
    await userModel.create({
      firstName, lastName, email, password, role,
    });
    return res.status(201).json({
      status: 'true',
      message: 'registration successful',
    });
  } catch (error) {
    return handleError(res);
  }
};

exports.getone = async (req, res) => {
  try {
    const userId = req.decodedId;
    const data = await userModel.findOne({ _id: userId });
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
    console.log('hi');
    return handleError(res);
  }
};

exports.getAggreone = async (req, res) => {
  const userId = req.decodedId;
  console.log(userId);
  const pipeline = [
    {
      $match: {
        _id: new ObjectId(userId),
      },
    },
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        password: 1,
        role: 1,
        email: 1,
      },
    },
  ];
  const value = await userModel.aggregate(pipeline);
  console.log('value', value);
  if (value) {
    return res.status(200).json({
      status: true,
      message: 'User retrieved successfully',
      result: value,
    });
  }
  return handleError(res);
};

exports.updateUser = async (req, res) => {
  try {
    const id = req.decodedId;
    console.log('id', id);
    const updateUser = req.body;
    const { error } = userUpdateSchema.validate(updateUser);
    if (error) {
      const errorMessage = error.details[0].message.replace(/['"]+/g, '');
      return res.status(400).json({
        status: false,
        message: errorMessage,
      });
    }
    if (req.file) {
      const imageBuffer = req.file.buffer;
      await userModel.updateOne({ _id: id }, { $set: { image: imageBuffer, ...updateUser } });
    } else {
      await userModel.updateOne({ _id: id }, { $set: updateUser });
    }
    return res.status(200).json({
      status: 'true',
      message: 'updated',
    });
  } catch (error) {
    return handleError(res);
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.decodedId;
    const { currentPassword, password } = req.body;
    const { err } = updatePassword.validate(password);
    if (err) {
      const errorMessage = err.details[0].message.replace(/['"]+/g, '');
      return res.status(400).json({
        status: false,
        message: errorMessage,
      });
    }
    const userToUpdate = await userModel.findById(userId);
    if (!userToUpdate) {
      return res.status(404).json({
        status: false,
        message: 'User Not Found',
      });
    }
    if (currentPassword !== userToUpdate.password) {
      return res.status(400).json({
        status: false,
        message: 'Current password is wrong',
      });
    }
    userToUpdate.password = password;
    await userToUpdate.save();
    return res.status(200).json({
      status: true,
      message: 'Password updated',
    });
  } catch (error) {
    return handleError(res);
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        status: false,
        message: 'Email is required',
      });
    }
    newOtp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      alphabets: false,
    });
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }
    user.otp = newOtp;
    await user.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'vaisakhg30@gmail.com',
        pass: 'oiadmibebbronett',
      },
    });

    const mailOptions = {
      from: 'ums@gmail.com',
      to: email,
      subject: 'OTP to reset password',
      text: newOtp,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return res.status(500).json({
          status: false,
          message: 'Failed to send OTP',
          error: error.message,
        });
      }
      return res.status(200).json({
        status: true,
        message: 'OTP sent successfully',
      });
    });
    return res.status(200).json({
      status: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.verifyotp = async (req, res) => {
  try {
    const { Otp, useremail } = req.body;
    console.log('Otp', Otp);
    console.log('useremail', useremail);
    const user = await userModel.findOne({ email: useremail, otp: Otp });
    if (user) {
      const accessToken = jwt.sign({ useremail, Otp }, envtoken, { expiresIn: '1h' });
      await userModel.findOneAndUpdate(
        { email: useremail },
        { $unset: { otp: '' } },
      );
      return res.status(200).json({
        status: true,
        message: 'OTP verified',
        accessToken,
      });
    }
    return res.status(400).json({
      status: false,
      message: 'Invalid OTP',
    });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.changepassword = async (req, res) => {
  try {
    const accessToken = req.headers.authorization;
    const decodedToken = jwt.verify(accessToken, envtoken);
    // console.log('decodedToken', decodedToken);

    const userEmail = decodedToken.useremail;
    console.log('userEmail', userEmail);

    const { password } = req.body;

    const { err } = updatePassword.validate(password);
    if (err) {
      const errorMessage = err.details[0].message.replace(/['"]+/g, '');
      return res.status(400).json({
        status: false,
        message: errorMessage,
      });
    }
    const result = await userModel.findOne({ email: userEmail });
    console.log('result', result.password);
    if (result) {
      result.password = password;
      console.log('result.password', result.password);
      await result.save();
      return res.status(200).json({
        status: true,
        message: 'Password updated',
      });
    }
    return res.status(404).json({
      status: false,
      message: 'User Not Found',
    });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.decodedId;
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({
        status: false,
        message: 'Product ID is missing in request parameters',
      });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: false,
        message: 'Product not found',
      });
    }
    let cartItem = await CartItem.findOne({ userId });
    if (!cartItem) {
      // If cartItem not found, create a new cartItem
      cartItem = new CartItem({
        userId,
        products: [],
      });
    }
    if (!cartItem.products) {
      cartItem.products = [];
    }
    const existingProductIndex = cartItem.products.findIndex((item) => {
      if (item.productId && item.productId.toString() === productId) {
        return true;
      }
      return false;
    });
    if (existingProductIndex !== -1) {
      cartItem.products[existingProductIndex].quantity += 1;
    } else {
      cartItem.products.push({
        productId: product._id,
        productName: product.productName,
        quantity: 1,
      });
    }
    await cartItem.save();
    return res.status(200).json({
      status: true,
      message: 'Product added to cart successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
    });
  }
};
// exports.getCartItems = async (req, res) => {
//   try {
//     const userId = req.decodedId;
//     const user = await userModel.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         status: false,
//         message: 'User not found',
//       });
//     }

//     // Ensure that the user object contains a cart property
//     if (!user.cart) {
//       return res.status(200).json({
//         status: true,
//         message: 'No cart items found',
//         currentPage: 1,
//         limit: 10,
//         totalCount: 0,
//         cartItems: [],
//       });
//     }

//     // Access the cart items of the user
//     const { page, limit } = req.query;
//     const currentPage = parseInt(page, 10) || 1;
//     const limitNumber = parseInt(limit, 10) || 10;
//     const startIndex = (currentPage - 1) * limitNumber;

//     // Paginate the cart items
//     const cartItemCount = user.cart.length;
//     const paginatedCartItems = user.cart.slice(startIndex, startIndex + limitNumber);
//     console.log(paginatedCartItems);

//     return res.status(200).json({
//       status: true,
//       message: 'Cart items retrieved successfully',
//       currentPage,
//       limit: limitNumber,
//       totalCount: cartItemCount,
//       cartItems: paginatedCartItems,
//     });
//   } catch (error) {
//     console.log(error);
//     return handleError(res);
//   }
// };

exports.getCartItems = async (req, res) => {
  try {
    const userId = req.decodedId;
    const data = await CartItem.findOne({ userId });
    console.log('data', data);
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
    console.log('hi');
    return handleError(res);
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const userId = req.decodedId;
    const { cartId } = req.params;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }
    const cartItem = await CartItem.findOne({ userId });
    console.log(cartItem);
    if (!cartItem) {
      return res.status(404).json({
        status: false,
        message: 'Cart not found',
      });
    }
    const data = await CartItem.updateOne(
      { userId },
      {
        $pull: {
          products: {
            _id: new ObjectId(cartId),
          },
        },
      },
      {
        multi: true,
      },
    );
    // console.log(data);

    if (data) {
      return res.status(200).json({
        status: true,
        message: 'Cart item deleted',
      });
    }

    return res.status(404).json({
      status: false,
      message: 'Cart item not found',
    });
  } catch (error) {
    console.log(error);
    return handleError(res);
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.decodedId;
    const { productId } = req.params;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: false,
        message: 'Product not found',
      });
    }

    let wishlistItem = await WishlistItem.findOne({ userId });

    // If wishlistItem doesn't exist, create a new one
    if (!wishlistItem) {
      wishlistItem = new WishlistItem({
        userId,
        products: [],
      });
    }

    const existingItem = wishlistItem.products.findIndex((item) => item
      .productId && item.productId.toString() === productId);
    if (existingItem !== -1) {
      return res.status(400).json({
        status: false,
        message: 'Product already exists in the wishlist',
      });
    }

    wishlistItem.products.push({
      productId: product._id,
      productName: product.productName,
    });

    await wishlistItem.save();

    return res.status(200).json({
      status: true,
      message: 'Product added to wishlist successfully',
    });
  } catch (error) {
    console.log(error);
    return handleError(res);
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const userId = req.decodedId;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'data not found',
      });
    }
    const { page, limit } = req.query;
    const currentPage = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const startIndex = (currentPage - 1) * limitNumber;
    const cartItemCount = user.wishlist.length;
    const paginatedCartItems = user.wishlist.slice(startIndex, startIndex + limitNumber);

    return res.status(200).json({
      status: true,
      message: 'Cart items retrieved successfully',
      currentPage,
      limit: limitNumber,
      totalCount: cartItemCount,
      wishlistItems: paginatedCartItems,
    });
  } catch (error) {
    return handleError(res);
  }
};

exports.deleteWishlist = async (req, res) => {
  try {
    const userId = req.decodedId;
    const wishlistId = req.params; // Access cartId correctly

    const user = await userModel.findById(userId);
    // console.log(user);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'wishlist not found',
      });
    }
    const data = await userModel.updateOne(
      { _id: userId },
      {
        $pull: {
          wishlist: {
            _id: new ObjectId(wishlistId),
          },
        },
      },
      {
        multi: true,
      },
    );
    // console.log('data', data)
    if (data) {
      return res.status(200).json({
        status: true,
        message: 'wishlist deleted',
      });
    }
    return res.status(404).json({
      status: false,
      message: 'wishlist not found',
    });
    // }
  } catch (error) {
    // console.log(error);
    return handleError(res);
  }
};

exports.orderProduct = async (req, res) => {
  try {
    const userId = req.decodedId;
    const { productId } = req.params;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: false,
        message: 'Product not found',
      });
    }
    const newOrder = orderModel.push(
      {
        product: productId,
        productName: product.productName,
        productPrice: product.productPrice,
        productDetails: product.productDetails,
        category: product.category,
        availability: product.availability,
        productCode: product.productCode,
        quantity: 1,
      },
    );
    await newOrder.save();
    return res.status(200).json({
      status: true,
      message: 'order successfully',
    });
  } catch (error) {
    return handleError(res);
  }
};
