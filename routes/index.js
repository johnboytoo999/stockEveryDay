// config
require('dotenv').config()

// Import our Controllers
const userController = require('../controllers/user.controller');
const stockController = require('../controllers/stock.controller');

// Import Swagger documentation
const userSchema = require('./schema/user.schema');
const stockSchema = require('./schema/stock.schema');

// API Key Check
let checkAPIKey = function (req, reply, done) {
  // login key check
  if (req.headers['api-key'] && req.headers['api-key'] === process.env.API_KEY) {
    done();
  } else {
    reply.code(403);
    done(new Error('你沒有權限執行此操作'));
  }
}

const routes = [{
    method: 'POST',
    url: '/api/user/login',
    handler: userController.loginUser,
    schema: userSchema({
      summary: '登入',
      body: {
        type: 'object',
        properties: {
          Account: {
            type: 'string'
          },
          Password: {
            type: 'string'
          }
        },
        required: ['Account', 'Password']
      },
      isNeedLogin: false, // If no need login, add this line
    })
  },
  // {
  //   method: 'GET',
  //   url: '/api/user',
  //   handler: userController.getAllUsers,
  //   preValidation: checkAPIKey, // If need login, add this line
  //   schema: userSchema({
  //     summary: '取得所有使用者'
  //   })
  // },
  // {
  //   method: 'GET',
  //   url: '/api/user/:id',
  //   handler: userController.getUser,
  //   schema: userSchema({
  //     summary: '根據ID取得使用者',
  //     params: {
  //       type: 'object',
  //       properties: {
  //         id: {
  //           type: 'number'
  //         }
  //       }
  //     }
  //   })
  // },
  {
    method: 'POST',
    url: '/api/user',
    handler: userController.createUser,
    schema: userSchema({
      summary: '新增使用者',
      body: 'default',
      isNeedLogin: false
    })
  },
  {
    method: 'PUT',
    url: '/api/user',
    handler: userController.updateUser,
    schema: userSchema({
      summary: '修改使用者(整個覆蓋)',
      body: 'default'
    })
  },
  {
    method: 'PATCH',
    url: '/api/user/:id',
    handler: userController.patchUser,
    schema: userSchema({
      summary: '修改使用者(只修改傳過來的欄位)',
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'number'
          }
        }
      },
    })
  },
  // {
  //   method: 'DELETE',
  //   url: '/api/user/:id',
  //   handler: userController.deleteUser,
  //   schema: userSchema({
  //     summary: '刪除使用者',
  //     params: {
  //       type: 'object',
  //       properties: {
  //         id: {
  //           type: 'number'
  //         }
  //       }
  //     }
  //   })
  // },
  {
    method: 'GET',
    url: '/api/TodayStock/:userID',
    handler: stockController.getToday,
    preValidation: checkAPIKey, // If need login, add this line
    schema: stockSchema({
      summary: '取得當日股票',
      params: {
        type: 'object',
        properties: {
          userID: {
            type: 'number'
          }
        }
      }
    })
  },
  {
    method: 'GET',
    url: '/api/message/:stockID',
    handler: stockController.getMessage,
    preValidation: checkAPIKey, // If need login, add this line
    schema: stockSchema({
      summary: '取得留言',
      params: {
        type: 'object',
        properties: {
          stockID: {
            type: 'number'
          }
        }
      }
    })
  },
  
  {
    method: 'GET',
    url: '/api/reply/:messageID',
    handler: stockController.getMessageReply,
    preValidation: checkAPIKey, // If need login, add this line
    schema: stockSchema({
      summary: '取得回復',
      params: {
        type: 'object',
        properties: {
          messageID: {
            type: 'number'
          }
        }
      }
    })
  },

  {
    method: 'GET',
    url: '/api/stock/:stockID',
    handler: stockController.getGuess,
    schema: stockSchema({
      summary: '查看猜測',
      params: {
        type: 'object',
        properties: {
          stockID: {
            type: 'number'
          }
        }
    }})
  },
  
  
  {
    method: 'POST',
    url: '/api/guess/:stockID',
    handler: stockController.userGuess,
    schema: stockSchema({
      summary: '使用者猜測',
      params: {
        type: 'object',
        properties: {
          stockID: {
            type: 'number'
          }
        }
      },
      body: 'guess'
    })
  },
  {
    method: 'POST',
    url: '/api/message/:stockID',
    handler: stockController.leaveMessage,
    schema: stockSchema({
      summary: '留言',
      params: {
        type: 'object',
        properties: {
          stockID: {
            type: 'number'
          }
        }
      },
      body: 'userMessage'
    })
  },
  {
    method: 'POST',
    url: '/api/reply/:messageID',
    handler: stockController.messageReplys,
    schema: stockSchema({
      summary: '回覆留言',
      params: {
        type: 'object',
        properties: {
          messageID: {
            type: 'number'
          }
        }
      },
      body: 'userMessage'
    })
  },

  {
    method: 'GET',
    url: '/api/history/:userID',
    handler: stockController.guessHistory,
    schema: stockSchema({
      summary: '歷史戰績',
      params: {
        type: 'object',
        properties: {
          userID: {
            type: 'number'
          }
        }
      },
    })
  },

  {
    method: 'GET',
    url: '/api/leaderboard',
    handler: stockController.leaderBoard,
    preValidation: checkAPIKey, // If need login, add this line
    schema: stockSchema({
      summary: '排行榜'
    })
  },

  {
    method: 'GET',
    url: '/api/updateStockGuess',
    handler: stockController.updateStock,
    preValidation: checkAPIKey, // If need login, add this line
    schema: stockSchema({
      summary: '更新猜測  '
    })
  },

  {
    method: 'GET',
    url: '/api/insertStock/:stockCodeID',
    handler: stockController.insertTodayStock,
    preValidation: checkAPIKey, // If need login, add this line
    schema: stockSchema({
      summary: '加入今日股票',
      params: {
        type: 'object',
        properties: {
          stockCodeID: {
            type: 'number'
          }
        }
      },
    })
  },
]

module.exports = routes