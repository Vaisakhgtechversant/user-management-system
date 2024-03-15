const mongoose = require('mongoose');

const registrationSchema = require('../schemas/registration.schema');
const updateSchema = require('../schemas/update.schema');
const userModel = require('../model/user.model');
// const { handleError } = require('../utils/serverError');

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
    return res.status(500).json({
      status: false,
      message: 'internal server error',
    });
  }
};

exports.updateUser = async (req, res) => {
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

    const data = await userModel.updateOne({ _id: userId }, { $set: req.body });

    if (!data) {
      return res.status(404).json({
        status: false,
        message: 'user not found',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'user update successfully',
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'internal server error',
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = await userModel.deleteOne({ _id: userId });

    if (data) {
      return res.status(200).json({
        status: true,
        message: 'deleted',
      });
    }
    return res.status(404).json({
      status: false,
      message: 'user not found',
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'internal server error',
    });
  }
};

exports.getuser = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { firstName: { $regex: new RegExp(search, 'i') } },
          { lastName: { $regex: new RegExp(search, 'i') } },
          { email: { $regex: new RegExp(search, 'i') } },
        ],
      };
    }
    const currentPage = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const startIndex = (currentPage - 1) * limitNumber;
    const totalCount = await userModel.countDocuments(query);
    const paginatedData = await userModel.find(query).skip(startIndex).limit(limitNumber);
    res.status(200).json({
      status: true,
      message: 'Users data retrieved successfully',
      currentPage,
      limit: limitNumber,
      totalCount,
      users: paginatedData,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'internal server error',
    });
  }
};

exports.aggreeGet = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { firstName: { $regex: new RegExp(search, 'i') } },
          { lastName: { $regex: new RegExp(search, 'i') } },
          { email: { $regex: new RegExp(search, 'i') } },
        ],
      };
    }
    const currentPage = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const startIndex = (currentPage - 1) * limitNumber;
    const pipeline = [
      { $match: query },
      { $skip: startIndex },
      { $limit: limitNumber },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          password: 1,
          role: 1,
          email: 1,
        },
      },
    ];
    const [totalCount, paginatedData] = await Promise.all([
      userModel.countDocuments(query),
      userModel.aggregate(pipeline).exec(),
    ]);
    res.status(200).json({
      status: true,
      message: 'Users data retrieved successfully',
      currentPage,
      limit: limitNumber,
      totalCount,
      users: paginatedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
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

exports.getone = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          password: 1,
          role: 1,
          email: 1,
        },
      },
    ];
    const data = await userModel.aggregate(pipeline);
    console.log('data', data);
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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
    });
  }
};
