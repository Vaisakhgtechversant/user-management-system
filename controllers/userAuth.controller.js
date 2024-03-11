const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const dotenv = require('dotenv');
const userModel = require('../model/user.model');
// const registrationSchema = require('../schemas/registration.schema');
const userRegistrationSchema = require('../schemas/userRegistration.schema');
const userUpdateSchema = require('../schemas/userupdate.schema');
const updatePassword = require('../schemas/updatePassword.schema');
const { handleError } = require('../utils/serverError');

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
    console.log('hi');
    const userId = req.decodedId;
    console.log('userId', userId);
    await userModel.findOne({ _id: userId }).then((data) => {
      if (data) {
        res.status(200).json({
          status: true,
          message: 'user retrieved successfully',
          result: data,
        });
      } else {
        res.status(404).json({
          status: false,
          message: 'user not found',
        });
      }
    });
  } catch (error) {
    console.log('hi');
    res.status(400).json({
      status: 'false',
      message: 'internal server error',
    });
  }
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
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
    });
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

    // Check if the user exists in the database
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }

    // Generate OTP
    newOtp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      alphabets: false,
    });

    // Update user document with the new OTP
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
  } catch (error) {
    return handleError(res, error);
  }
};

exports.verifyotp = async (req, res) => {
  try {
    
    await userModel.findOne({  })
    console.log('newOtp', newOtp);
    const { otp } = req.body;
    console.log('otp', otp);
    if (otp !== newOtp) {
      console.log('newotp:', newOtp);
      return res.status(400).json({
        status: false,
        message: 'Invalid OTP',
      });
    }
    // Clear the OTP after successful verification
    newOtp = null;
    // Generate an access token
    const userId = req.decodedId;
    console.log('userId', userId);
    const accessToken = jwt.sign({ userId }, envtoken, { expiresIn: '1h' });

    return res.status(200).json({
      status: true,
      message: 'OTP verified',
      accessToken,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.changepassword = async (req, res) => {
  try {
    const accessToken = req.headers.authorization;
    const decodedToken = jwt.verify(accessToken, envtoken);
    console.log('decodedToken', decodedToken);

    const userId = decodedToken.id;

    const { password, confirmPassword } = req.body;

    const { error } = Joi.object({
      password: Joi.string().min(8).required(),
      confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .strict()
        .messages({
          'any.only': 'Passwords do not match',
        }),
    }).validate({ password, confirmPassword });

    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }

    // Find the user by ID in the database
    const userToUpdate = await userModel.findById(userId);

    if (!userToUpdate) {
      return res.status(404).json({
        status: false,
        message: 'User Not Found',
      });
    }

    // Update the user's password
    userToUpdate.password = password;
    await userToUpdate.save();

    return res.status(200).json({
      status: true,
      message: 'Password Changed',
    });
  } catch (error) {
    return handleError(res, error);
  }
};
