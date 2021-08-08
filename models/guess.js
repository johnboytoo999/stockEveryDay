const knex = require('../config/knexfile');
const bookshelf = require('bookshelf')(knex);


// Defining models
const Guess = bookshelf.model('guess', {
  tableName: 'Guess',
});


module.exports = Guess;