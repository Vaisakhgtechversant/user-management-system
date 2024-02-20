const path = require('path');
const fs = require('fs');

exports.saveBlog = async (req, res) => {
  try {
    res.status(200).send({ status: 'success', message: 'file uploaded successfully', filename: req.body.filename });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server errorsss');
  }
};

exports.getimage = ((req, res) => {
  const fileName = req.params.filename;
  console.log(fileName);
  const filePath = path.join('images/', fileName);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found');
    }
    res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-type', 'application/octet-stream');
    const fileStream = fs.createReadStream(filePath);
    return fileStream.pipe(res);
  });
});

exports.updateImage = (req, res) => {
  try {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, 'images', fileName);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.status(404).send('File not found');
      }

      // Get the updated image data from the request body
      const { imageData } = req.body;

      // Write the updated image data to the file
      fs.writeFile(filePath, imageData, (writeErr) => {
        if (writeErr) {
          console.error(writeErr);
          res.status(500).send('Failed to update image');
        }

        // Image updated successfully
        res.status(200).send('Image updated successfully');
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};
