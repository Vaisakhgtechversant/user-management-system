const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const user = require('../sampleData/data.json');

dotenv.config();
exports.verifyUser = (req, res, next) => {
  try {
    const { envtoken } = process.env;
    const token = req.headers.authorization;
    if (token) {
      try {
        const decodedId = jwt.verify(token, envtoken);
        req.decodedId = decodedId.id;
        const userData = user.find((value) => value.id === decodedId.id);
        if (userData) {
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
    res.status(500).send('Internal Server Error');
  }
};
