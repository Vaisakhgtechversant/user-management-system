const userModel = require('../model/user.model');
const addressSchema = require('../schemas/addressSchema');
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
    const addressData = await addressModel.findOne({ userId });
    console.log(addressData);
    if (!addressData) {
          addressData = new addressModel({ userId, address: [] });
    }
  } catch (error) {

  }
};
