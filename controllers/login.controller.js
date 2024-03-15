const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const userModel = require('../model/user.model');
const loginSchema = require('../schemas/login.schema');

dotenv.config();
const { envtoken, REFRESH_TOKEN_SECRET } = process.env;
exports.login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { email, password } = req.body;
    const result = await userModel.findOne({ email });
    if (result && result.password === password) {
      const { _id, name, role } = result;
      const token = jwt.sign({
        id: _id, name, role, password,
      }, envtoken, { expiresIn: '1hr' });
      const refreshToken = jwt.sign({ id: _id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
      return res.status(200).json({
        status: 'true',
        message: 'login successful',
        access_token: token,
        refresh_token: refreshToken,
        role,
      });
    }
    return res.status(400).json({
      status: 'false',
      message: 'invalid email or password',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'false',
      message: 'Internal Server Error',
    });
  }
};

exports.refreshtoken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({
        status: false,
        message: 'refresh token is required',
      });
    }
    const decodedToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const userId = decodedToken.id;
    if (!userId) {
      return res.status(400).json({
        status: false,
        message: 'invalid refresh token',
      });
    }
    const newToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return res.status(200).json({
      status: true,
      access_token: newToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: false,
      message: 'error refreshing token',
    });
  }
};
