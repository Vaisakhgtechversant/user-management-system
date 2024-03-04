const path = require('path');
const fs = require('fs');

exports.saveBlog = async (req, res) => {
  try {
    res.status(200).json({
      status: true,
      message: 'upload success',
      imageURL: req.body.imageURL,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'internal server error',
    });
  }
};

exports.getimage = ((req, res) => {
  const fileName = req.params.filename;
  console.log(fileName);
  const filePath = path.join('images/', fileName);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({
        status: false,
        message: 'file not found',
      });
    }
    res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-type', 'application/octet-stream');
    const fileStream = fs.createReadStream(filePath);
    return fileStream.pipe(res);
  });
});
