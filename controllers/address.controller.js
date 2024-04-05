const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const userModel = require('../model/user.model');
const addressSchema = require('../schemas/addressSchema');

const AddressModel = require('../model/address.model');
const { handleError } = require('../utils/serverError');
const addressModel = require('../model/address.model');

exports.add_address = async (req, res) => {
  try {
    const userId = req.decodedId;
    const { error } = addressSchema.validate(req.body);
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
    let addressData = await AddressModel.findOne({ userId });
    console.log(addressData);
    if (!addressData) {
      addressData = new AddressModel({ userId, address: [] });
    }
    const {
      fullName, phoneNumber, alternateNumber,
      pincode, state, city, buildingName, area, landmark,
    } = req.body;
    addressData.address.push({
      fullName,
      phoneNumber,
      alternateNumber,
      pincode,
      state,
      city,
      buildingName,
      area,
      landmark,
    });
    await addressData.save();
    return res.status(200).json({
      status: true,
      message: 'address added successfully',
    });
  } catch (error) {
    return handleError(res);
  }
};

exports.view_address = async (req, res) => {
  const userId = req.decodedId;
  const pipeline = [
    {
      $match: {
        userId: new ObjectId(
          userId,
        ),
      },
    },
  ];
  const value = await addressModel.aggregate(pipeline);
  console.log('value', value);
  if (value) {
    return res.status(200).json({
      status: true,
      message: 'address retrieved successfully',
      result: value,
    });
  }
  return handleError(res);
};

exports.edit_address = async (req, res) => {
  try {
    const userId = req.decodedId;
    const addressId = req.params;

    const { error } = addressSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message.replace(/['"]+/g, '');
      return res.status(400).json({
        status: false,
        message: errorMessage,
      });
    }

    const updatedAddressData = req.body;

    const address = await AddressModel.findOneAndUpdate(
      { userId, 'address._id': new ObjectId(addressId) },
      { $set: { 'address.$': updatedAddressData } },
      { new: true },
    );

    if (!address) {
      return res.status(404).json({
        status: false,
        message: 'Address not found',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Address updated successfully',
      address: address.address,
    });
  } catch (error) {
    console.log(error);
    return handleError(res);
  }
};

exports.delete_address = async (req, res) => {
  const userId = req.decodedId;
  const addressId = req.params;

  const user = await userModel.findById(userId);
  if (!user) {
    return res.status(404).json({
      status: false,
      message: 'User not found',
    });
  }
  const cartItem = await addressModel.findOne({ userId });
  console.log(cartItem);
  if (!cartItem) {
    return res.status(404).json({
      status: false,
      message: 'Cart not found',
    });
  }
  const data = await addressModel.updateOne(
    { userId },
    {
      $pull: {
        address: {
          _id: new ObjectId(addressId),
        },
      },
    },
  );
  if (data) {
    return res.status(200).json({
      status: true,
      message: 'address item deleted',
    });
  }
  return res.status(404).json({
    status: false,
    message: 'address not found',
  });
};
