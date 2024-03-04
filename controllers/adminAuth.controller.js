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
      res.status(400).json({
        status: false,
        message: errorMessage,
      });
    }
    const index = userData.findIndex((data) => data.id === userId);
    console.log(index);
    if (index !== -1) {
      userData[index] = { ...userData[index], ...updateUser };
      writeUsers(userData);
      res.status(200).json({
        status: 'true',
        message: 'user update successfully',
      });
    } else {
      res.status(404).json({
        status: 'false',
        message: 'user not found',
      });
    }
  } catch (error) {
    res.status(400).json({
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
    userToDelete.deletedAt = new Date().toISOString();

    writeUsers(userData);

    return res.status(200).json({
      status: true,
      message: 'User soft-deleted successfully', // Updated response message
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
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = 10;
    const totalUsers = userData.length;

    const totalPages = Math.ceil(totalUsers / pageSize);

    if (page < 1 || page > totalPages) {
      res.status(404).json({
        status: false,
        message: 'Page not found',
      });
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalUsers);

    const paginatedData = userData.slice(startIndex, endIndex);

    res.status(200).json({
      status: true,
      message: 'Users data retrieved successfully',
      currentPage: page,
      totalPages,
      data: paginatedData,
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

exports.search = (req, res) => {
  try {
    const { firstName } = req.query;
    const { lastName } = req.query;

    // Filter users based on provided first name and/or last name
    const searchResults = userData.filter((user) => {
      if (
        (!firstName || user.firstName.toLowerCase().includes(firstName.toLowerCase()))
        && (!lastName || user.lastName.toLowerCase().includes(lastName.toLowerCase()))
      ) {
        return true;
      }
      return false;
    });

    res.status(200).json({
      status: true,
      message: 'Search successful',
      data: searchResults,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
    });
  }
};
