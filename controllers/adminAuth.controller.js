const registrationSchema = require('../schemas/registration.schema');
const updateSchema = require('../schemas/update.schema');
const userModel = require('../model/user.model');

exports.addUser = async (req, res) => {
  try {
    const { error } = registrationSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message.replace(/['"]+/g, '');
      return res.status(400).json({
        status: false,
        message: errorMessage,
      });
    }
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({
        status: false,
        message: 'Email already exists',
      });
    }
    if (req.body.role !== 'agent' && req.body.role !== 'supervisor' && req.body.role !== 'qa' && req.body.role !== 'qc') {
      return res.status(403).json({
        status: 'false',
        message: 'unauthorized role',
      });
    }
    const {
      firstName, lastName, email, password, role,
    } = req.body;
    await userModel.create({
      firstName, lastName, email, password, role,
    });
    return res.status(201).json({
      status: 'true',
      message: 'registration successful',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'false',
      message: 'token missing or invalid',
    });
  }
};

exports.updateUser = (req, res) => {
  try {
    const userId = req.params.id;

    const updateUser = req.body;

    const { error } = updateSchema.validate(updateUser);
    if (error) {
      const errorMessage = error.details[0].message.replace(/['"]+/g, '');
      return res.status(400).json({
        status: false,
        message: errorMessage,
      });
    }

    const index = userModel.updateOne({ id: userId });
    console.log('index', index);

    if (index !== -1) {
      userModel[index] = { ...userModel[index], ...updateUser };
      return res.status(200).json({
        status: 'true',
        message: 'user update successfully',
      });
    }
    return res.status(404).json({
      status: 'false',
      message: 'user not found',
    });
  } catch (error) {
    return res.status(400).json({
      status: 'false',
      message: 'internal server error',
    });
  }
};

exports.deleteUser = (req, res) => {
  try {
    const userId = Number(req.params.id);
    const userToDelete = userData.find((user) => user.id === userId);
    if (!userToDelete) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }
    if (userToDelete.role === 'admin') {
      return res.status(400).json({
        status: false,
        message: 'Cannot delete admin',
      });
    }
    const indexToRemove = userData.indexOf(userToDelete);
    userData.splice(indexToRemove, 1);
    writeUsers(userData);

    return res.status(200).json({
      status: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
    });
  }
};

exports.getuser = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limitNumber = parseInt(req.query.page, 10) || 10;
    const startIndex = (page - 1) * limitNumber;
    const totalCount = await userModel.countDocuments();
    const paginatedData = await userModel.find().skip(startIndex).limit(limitNumber);

    res.status(200).json({
      status: true,
      message: 'Users data retrieved successfully',
      currentPage: page,
      limit: limitNumber,
      totalCount,
      users: paginatedData,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: false,
      message: 'Token is missing',
    });
  }
};

exports.getOne = (req, res) => {
  const userId = req.params.id;
  userModel.findOne({ _id: userId })
    .then((data) => {
      if (data) {
        res.status(200).json({
          status: true,
          message: 'User retrieved successfully',
          result: data,
        });
      } else {
        res.status(404).json({
          status: false,
          message: 'User not found',
        });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        status: false,
        message: 'Internal server error',
      });
    });
};

exports.searchuser = (req, res) => {
  try {
    const searchParam = req.params.search.toLowerCase();
    console.log('searchParam');

    let filteredUsers;
    if (searchParam) {
      console.log('inside');
      filteredUsers = userData
        .filter((user) => (user.firstName
          ? user.firstName.toLowerCase().includes(searchParam) : false)
        || (user.lastName
          ? user.lastName.toLowerCase().includes(searchParam) : false)
        || (user.email ? user.email.toLowerCase().includes(searchParam) : false));
    } else {
      console.log('userData', userData);
      filteredUsers = userData;
    }

    res.status(200).json({
      status: true,
      message: 'Users data retrieved successfully',
      data: filteredUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: false,
      message: 'An error occurred while searching for users',
    });
  }
};
