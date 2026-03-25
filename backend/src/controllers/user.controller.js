const UserService = require("../services/user.service");
const { sendSuccess } = require("../utils/response");

const listUsers = async (req, res, next) => {
  try {
    const result = await UserService.listUsers(req.query);
    return sendSuccess(res, 200, "Users fetched", result.items, result.meta);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    return sendSuccess(res, 200, "User fetched", user);
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const user = await UserService.updateUserStatus(req.params.id, req.body);
    return sendSuccess(res, 200, "User updated", user);
  } catch (error) {
    next(error);
  }
};

const createUserByAdmin = async (req, res, next) => {
  try {
    const user = await UserService.createUserByAdmin(req.body);
    return sendSuccess(res, 201, "User created", user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listUsers,
  getUserById,
  updateUserStatus,
  createUserByAdmin,
};
