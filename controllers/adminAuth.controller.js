const Joi = require('@hapi/joi');
const userData = require('../sampleData/user.json');

const authSchema = Joi.object({
  username: Joi.string().min(2),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().required(),
});

exports.addUser = (req, res) => {
  try {
    const { error } = authSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    if (req.body.role !== 'agent' && req.body.role !== 'supervisor' && req.body.role !== 'qa' && req.body.role !== 'qc') {
      return res.status(403).json({
        status: 'false',
        message: 'Unauthorized role',
      });
    }
    const newUser = { id: userData.length + 1, ...req.body };
    const emailExist = userData.find((value) => value.email === newUser.email);
    if (emailExist) {
      return res.status(400).json({
        status: 'false',
        message: 'Email is already exist',
      });
    }
    const idExist = userData.find((value) => value.id === newUser.id);
    if (idExist) {
      return res.status(400).json({
        status: 'false',
        message: 'Id is already exist',
      });
    }
    userData.push(newUser);
    return res.status(200).json({
      status: 'true',
      message: 'New User Added',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'false',
      message: 'Internal Server Error',
    });
  }
};

exports.getuser = (req, res) => {
  try {
    res.send(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'false',
      message: 'Internal Server Error',
    });
  }
};

exports.updateUser = (req, res) => {
  try {
    const userId = Number(req.params.id);
    const updateUser = req.body;
    const index = userData.findIndex((data) => data.id === userId);
    console.log(index);
    if (index !== -1) {
      userData[index] = { ...userData[index], ...updateUser };
      res.status(200).json({
        status: 'true',
        message: 'Updated',
      });
    } else {
      res.status(404).json({
        status: 'false',
        message: 'User Not Found',
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'false',
      message: 'Internal Server Error',
    });
  }
};

exports.deleteUser = (req, res) => {
  try {
    const userId = Number(req.params.id);
    const indexToRemove = userData.findIndex((user) => user.id === userId);
    if (req.body.role !== 'admin') {
      res.status(403).json({
        status: 'false',
        message: 'Access denied. Only admins can perform this action',
      });
    }
    if (indexToRemove !== -1) {
      userData.splice(indexToRemove, 1);
      return res.status(200).json({
        status: 'true',
        message: 'User Deleted',
      });
    }
    return res.status(404).json({
      status: 'false',
      message: 'User Not Found',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'false',
      message: 'Internal Server Error',
    });
  }
};
