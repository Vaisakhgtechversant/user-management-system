exports.saveImg = async (req, res) => {
  try {
    res.status(200).send({ status: 'success', message: 'file uploaded successfully', filename: req.body.filename });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server errorsss');
  }
};
