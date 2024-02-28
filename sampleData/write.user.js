const fs = require('fs').promises;

const usersFilePath = 'sampleData/data.json';

module.exports = async (data) => {
  fs.writeFile(usersFilePath, JSON.stringify(data, null, 2));
};
