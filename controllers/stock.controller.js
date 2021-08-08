// External Dependancies
const response = require('../models/response');

// Get Data Models
const stockService = require('../services/stock.service');


module.exports = {
  // login user
  getToday: async (req, reply) => {
    try {
      const stock = await stockService.getToday(req.params.userID);
      return response.SUCCESS(stock);
    } catch (e) {
      throw response.FAIL(e);
    }
  },
  getMessage: async (req, reply) => {
    try {
      const messages = await stockService.getMessage(req.params.stockID);
      return response.SUCCESS(messages);
    } catch (e) {
      throw response.FAIL(e);
    }
  },
  getMessageReply: async (req, reply) => {
    try {
      const messageReplys = await stockService.getMessageReply(req.params.messageID);
      return response.SUCCESS(messageReplys);
    } catch (e) {
      throw response.FAIL(e);
    }
  },

  getGuess: async (req, reply) => {
    try {
      console.log(req.params.stockID);
      const messageReplys = await stockService.getGuess(req.params.stockID);
      return response.SUCCESS(messageReplys);
    } catch (e) {
      throw response.FAIL(e);
    }
  },

  userGuess: async (req, reply) => {
    try {
    
      const messageReplys = await stockService.guessStock(req);
      return response.SUCCESS(messageReplys);
    } catch (e) {
      throw response.FAIL(e);
    }
  },

  leaveMessage: async (req, reply) => {
    try {
    
      const leaveMessage = await stockService.leaveMessage(req);
      return response.SUCCESS(leaveMessage);
    } catch (e) {
      throw response.FAIL(e);
    }
  },

  messageReplys: async (req, reply) => {
    try {
    
      const messageReplys = await stockService.replyMessage(req);
      return response.SUCCESS(messageReplys);
    } catch (e) {
      throw response.FAIL(e);
    }
  },

  guessHistory: async (req, reply) => {
    try {
    
      const guessHistory = await stockService.GuessHistory(req.params.userID);
      return response.SUCCESS(guessHistory);
    } catch (e) {
      throw response.FAIL(e);
    }
  },

  leaderBoard: async (req, reply) => {
    try {
    
      const leaderBoard = await stockService.LeaderBoard();
      return response.SUCCESS(leaderBoard);
    } catch (e) {
      throw response.FAIL(e);
    }
  },

  updateStock: async (req, reply) => {
    try {
    
      const stocks = await stockService.UpdateGuess();
      return response.SUCCESS(stocks);
    } catch (e) {
      throw response.FAIL(e);
    }
  },

  insertTodayStock: async (req, reply) => {
    try {
    
      const stocks = await stockService.InsertTodayStock(req.params.stockCodeID);
      return response.SUCCESS(stocks);
    } catch (e) {
      throw response.FAIL(e);
    }
  },
}