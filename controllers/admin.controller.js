const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Joi = require('@hapi/joi');
const adminData = require('../sampleData/admin.json');

dotenv.config();

const { envtoken } = process.env;

const authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
});

exports.login = async (req, res) => {
  try {
    const { error } = await authSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { email, password } = req.body;
    const result = adminData.find((data) => data.email === email);
    if (result && result.password === password) {
      const token = jwt.sign({ id: result.id }, envtoken);
      return res.status(200).send({ message: 'Successfully logged in', access_token: token });
    }
    return res.status(400).send('Invalid email or password');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};
