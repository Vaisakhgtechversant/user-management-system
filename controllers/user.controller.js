const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Joi = require('@hapi/joi');
const userData = require('../sampleData/user.json');

const authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
  role: Joi.string().required(),
});
dotenv.config();
const { envtoken } = process.env;

exports.login = (req, res) => {
  try {
    const { error } = authSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    if (req.body.role !== 'agent' && req.body.role !== 'supervisor' && req.body.role !== 'qa' && req.body.role !== 'qc') {
      return res.status(403).json({
        status: 'false',
        message: 'Unauthorized role',
      });
    }
    const { email, password } = req.body;
    const result = userData.find((data) => data.email === email);
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
      message: 'Invalid User',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'false',
      message: 'Internal Server Error',
    });
  }
};
