const userData = require('../sampleData/data.json');
const writeUsers = require('../sampleData/write.user');
const registrationSchema = require('../schemas/registration.schema');
const updateSchema = require('../schemas/update.schema');

exports.addUser = (req, res) => {
  try {
    const { error } = registrationSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message.replace(/['"]+/g, '');
      return res.status(400).json({
        status: false,
        message: errorMessage,
      });
    }
    if (req.body.role !== 'agent' && req.body.role !== 'supervisor' && req.body.role !== 'qa' && req.body.role !== 'qc') {
      return res.status(403).json({
        status: 'false',
        message: 'unauthorized role',
      });
    }
    const newUser = { id: new Date().getTime(), createdAT: new Date(), ...req.body };
    const emailExist = userData.find((value) => value.email === newUser.email);
    if (emailExist) {
      return res.status(409).json({
        status: 'false',
        message: 'email is already exist',
      });
    }
    const idExist = userData.find((value) => value.id === newUser.id);
    if (idExist) {
      return res.status(409).json({
        status: 'false',
        message: 'id is already exist',
      });
    }
    userData.push(newUser);
    writeUsers(userData);
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
    const userId = Number(req.params.id);
    const updateUser = req.body;
    const { error } = updateSchema.validate(updateUser);
    if (error) {
      const errorMessage = error.details[0].message.replace(/['"]+/g, '');
      return res.status(400).json({
        status: false,
        message: errorMessage,
      });
    }
    const index = userData.findIndex((data) => data.id === userId);
    if (index !== -1) {
      userData[index] = { ...userData[index], ...updateUser };
      writeUsers(userData);
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

exports.getuser = (req, res) => {
  try {
    const { page, limit, search } = req.query;
    let filteredData = userData;
    if (search) {
      console.log('inside');
      filteredData = userData
        .filter((user) => (user.firstName
          ? user.firstName.toLowerCase().includes(search) : false)
        || (user.lastName
          ? user.lastName.toLowerCase().includes(search) : false)
        || (user.email ? user.email.toLowerCase().includes(search) : false));
    } else {
      console.log('userData', userData);
      filteredData = userData;
    }
    const currentPage = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const startIndex = (currentPage - 1) * limitNumber;
    const paginatedData = filteredData.slice(startIndex, startIndex + limitNumber);
    res.status(200).json({
      status: true,
      message: 'Users data retrieved successfully',
      currentPage,
      limit: limitNumber,
      totalCount: filteredData.length,
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
  try {
    const userId = Number(req.params.id);
    const getOne = userData.find((data) => data.id === userId);
    if (getOne) {
      res.status(200).json({
        status: true,
        message: 'user retrieved successfully',
        data: getOne,
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'user not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'internal server error',
    });
  }
};
exports.searchuser = (req, res) => {
  try {
    const searchParam = req.params.search.toLowerCase();
    console.log('searchParam', searchParam);

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
