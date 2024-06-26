const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const userModel = require('../model/user.model');

dotenv.config();
exports.verifyAdmin = (req, res, next) => {
  try {
    const { envtoken } = process.env;
    const token = req.headers.authorization;
    if (token) {
      try {
        const decodedId = jwt.verify(token, envtoken);
        req.decodedId = decodedId.id;
        const verifyData = userModel.findOne({ id: decodedId.id });
        if (verifyData) {
          next();
        } else {
          res.status(400).send('User not found');
        }
      } catch (jwtError) {
        res.status(401).send('Invalid or expired token');
      }
    } else {
      res.status(400).send('Token missing or invalid');
    }
  } catch (error) {
    res.status(500).send('Token missing or invalid');
  }
};
