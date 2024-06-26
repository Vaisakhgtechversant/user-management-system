const bcrypt = require('bcrypt');

const checkPassword = async (password, passwordHash) => new Promise((resolve, reject) => {
  bcrypt.compare(password, passwordHash, (err, same) => {
    if (err) {
      reject(err);
    }

    resolve(same);
  });
});
module.exports = checkPassword;
