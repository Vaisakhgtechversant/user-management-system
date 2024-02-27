const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Joi = require('@hapi/joi');
const userData = require('../sampleData/user.json');

const authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
});
dotenv.config();
const { envtoken, REFRESH_TOKEN_SECRET } = process.env;

exports.login = (req, res) => {
  try {
    const { error } = authSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const { email, password } = req.body;
    const result = userData.find((data) => data.email === email);
    console.log('userData:', userData);
    if (result && result.password === password) {
      console.log('result:', result);
      const token = jwt.sign({ id: result.id, role: result.role }, envtoken);
      const refreshToken = jwt.sign({ id: result.id }, REFRESH_TOKEN_SECRET, { expiresIn: '1hr' });
      return res.status(200).json({
        status: 'true',
        message: 'login successful',
        access_token: token,
        refresh_token: refreshToken,
      });
    }
    return res.status(400).json({
      status: 'false',
      message: 'invalid email or password',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'false',
      message: 'internal server error',
    });
  }
};
