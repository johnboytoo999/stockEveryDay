const knex = require('../config/knexfile');
const bookshelf = require('bookshelf')(knex);


// Defining models
const Message = bookshelf.model('Message', {
  tableName: 'Message',
  MessageReply() {
    return this.belongsTo('MessageReply')
  }
});


module.exports = Message;