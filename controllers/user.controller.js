// External Dependancies
const response = require('../models/response');

// Get Data Models
const userService = require('../services/user.service');


module.exports = {
  // login user
  loginUser: async (req, reply) => {
    try {
      const users = await userService.login(req.body.Account, req.body.Password);
      return response.SUCCESS(users);
    } catch (e) {
      throw response.FAIL(e);
    }
  },

  // Get all users
  getAllUsers: async (req, reply) => {
    try {
      const users = await userService.getAll();
      // console.log(users);
      return response.SUCCESS(users);
    } catch (e) {
      throw response.FAIL(e);
    }
  },

  // Get user by id
  getUser: async (req, reply) => {
    try {
      const user = await userService.getByID(req.params.id);
      return response.SUCCESS(user);
    } catch (e) {
      throw response.FAIL(e);
    }
  },

  // Create user
  createUser: async (req, reply) => {
    try {
      const user = await userService.insert(req.body);
      return response.SUCCESS(user);
    } catch (e) {
      throw response.FAIL(e);
    }
  },

  // Update user with entire user object
  updateUser: async (req, reply) => {
    try {
      const user = await userService.update(req.body);
      return response.SUCCESS(user);
    } catch (e) {
      throw response.FAIL(e);
    }
  },

  // Update user with id and some field
  patchUser: async (req, reply) => {
    try {
      const user = await userService.patch(req.params.id, req.body);
      return response.SUCCESS(user);
    } catch (e) {
      throw res
    }
  },

  // Delete user
  deleteUser: async (req, reply) => {
    try {
      const result = await userService.delete(req.params.id);
      return response.SUCCESS(result);
    } catch (e) {
      throw response.FAIL(e);
    }
  },
}