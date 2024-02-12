const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Joi = require('@hapi/joi');
const adminData = require('../sampleData/admin.json');

dotenv.config();

const { envtoken } = process.env;

const authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
  role: Joi.string().required(),

});

exports.login = (req, res) => {
  try {
    const { error } = authSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    if (req.body.role !== 'admin') {
      return res.status(403).json({
        status: 'false',
        message: 'Access denied. Only admins can perform this action',
      });
    }
    const { email, password } = req.body;
    const result = adminData.find((data) => data.email === email);
    if (result && result.password === password) {
      const token = jwt.sign({ id: result.id }, envtoken);
      return res.status(200).json({
        status: 'true',
        message: 'successfully logging',
        access_token: token,
      });
    }
    return res.status(400).json({
      status: 'false',
      message: 'Invalid email or password',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'false',
      message: 'Internal Server Error',
    });
  }
};
