const knex = require('../config/knexfile');
const bookshelf = require('bookshelf')(knex);


// Defining models
const Taiex = bookshelf.model('Taiex', {
  tableName: 'Taiex',
});


module.exports = Taiex;