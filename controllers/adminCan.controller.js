const Joi = require('@hapi/joi');
const userData = require('../sampleData/user.json');

const authSchema = Joi.object({
  id: Joi.number().required(),
  username: Joi.string().min(2),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
});

exports.addUser = async (req, res) => {
  try {
    const { error } = await authSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const newUser = req.body;
    const emailExist = userData.find((value) => value.email === newUser.email);
    if (emailExist) {
      return res.status(400).send('Email is already exist');
    }
    const idExist = userData.find((value) => value.id === newUser.id);
    if (idExist) {
      return res.status(400).send('Id is already exist');
    }
    userData.push(newUser);
    return res.status(200).send('New User Saved');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

exports.getuser = (req, res) => {
  try {
    res.send(userData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
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
      res.status(200).send('updated');
    } else {
      res.status(404).send('User Not Found');
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteUser = (req, res) => {
  try {
    const userId = Number(req.params.id);
    const indexToRemove = userData.findIndex((user) => user.id === userId);
    if (indexToRemove !== -1) {
      userData.splice(indexToRemove, 1);
      return res.status(200).send('User Deleted');
    }
    return res.status(404).send('User Not Found');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
};
