const knex = require('../config/knexfile');
const bookshelf = require('bookshelf')(knex);


// Defining models
const MessageReply = bookshelf.model('messageReply', {
  tableName: 'MessageReply',
});


module.exports = MessageReply;