const userModel = require('../model/user.model');
const addressSchema = require('../schemas/addressSchema');
const AddressModel = require('../model/address.model');
const { handleError } = require('../utils/serverError');

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
