const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyUserRole = async (req, res, next) => {
  try {
    const { envtoken } = process.env;
    const token = req.headers.authorization;
    const { genericvalue } = req.headers;
    if (token && genericvalue) {
      try {
        const decodedId = jwt.verify(token, envtoken);
        if (decodedId.role === genericvalue && genericvalue != null) {
          next();
        } else {
          res.status(401).send('Unauthorised access');
        }
      } catch (jsonParseError) {
        res.status(500).send('Token missing or invalid');
      }
    } else {
      res.status(403).send('choose generic value');
    }
  } catch (error) {
    res.status(403).send('Token Expires');
  }
};
