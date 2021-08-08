require('dotenv').config();
const moment = require('moment-timezone');
var knexOption = {
    development: {
        client: 'mysql',
        connection: {
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASS,
            database: process.env.DATABASE_NAME,
            timezone: 'UTC',
            typeCast: function (field, next) {
                if (field.name == 'CreateTime' || field.name == 'ModifyTime') {
                    // console.log(field.string());
                    return moment.utc(field.string()).tz("Asia/Taipei").format();
                }
                return next();
            }
        }
    }
}
var knex = require('knex')(knexOption.development);

module.exports = knex;