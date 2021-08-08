const knex = require('../config/knexfile');
const bookshelf = require('bookshelf')(knex);


// Defining models
const TodayStock = bookshelf.model('TodayStock', {
  tableName: 'TodayStock',
});


module.exports = TodayStock;