const fs = require('fs').promises;

const usefsFilePath = '/sampleData/user.json';
module.exports = async (data) => {
  fs.writeFile(usefsFilePath, data);
};
