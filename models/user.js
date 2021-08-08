const knex = require('../config/knexfile');
const bookshelf = require('bookshelf')(knex);


// Defining models
const User = bookshelf.model('User', {
  tableName: 'User',
  hidden: ['Password'] // hide password in result
});


module.exports = User;