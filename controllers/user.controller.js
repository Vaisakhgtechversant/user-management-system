const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Joi = require('@hapi/joi');
const userData = require('../sampleData/user.json');

const authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
});
dotenv.config();
const { envtoken } = process.env;

exports.login = async (req, res) => {
  try {
    const { error } = await authSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { email } = req.body;
    const { password } = req.body;
    const result = userData.find((data) => data.email === email);
    if (result && result.password === password) {
      const token = jwt.sign({ id: result.id }, envtoken);
      return res.status(200).send({ messege: 'successfully Login', access_token: token });
    }
    return res.status(400).send('invalid user');
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};
