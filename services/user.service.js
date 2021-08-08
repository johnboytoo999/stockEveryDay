require('dotenv').config()
const User = require('../models/user');

// If need custom query, import knex
const knex = require('../config/knexfile');

const _cryptoService = require('./crypto.service');

module.exports = {
    getAll: async () => {
        try {
            const users = await User.fetchAll();
            return users;
        } catch (e) {
            throw e;
        }
    },

    getByID: async (id) => {
        try {
            const user = await User.where('ID', id).fetch();
            return user;
        } catch (e) {
            if (e.message == 'EmptyResponse') e.message = '查無該使用者';
            throw e;
        }
    },

    insert: async (user) => {
        try {
            // 密碼檢核: 至少一個數字或英文且6~15位
            var re = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{6,15})$/;
            if (!re.test(user.Password)) {
                throw new Error('密碼格式錯誤: 需為6~15位的英文和數字');
            } else {
                // 加密
                user.Password = _cryptoService.encrypt(user.Password);
            }
            const result = await User.forge(user).save();
            return result;
        } catch (e) {
            if(e.code === 'ER_DUP_ENTRY') e.message = '此帳號已註冊過';
            throw e;
        }
    },

    // user.ID is required
    update: async (user) => {
        try {
            // create time no need to update
            delete user.CreateTime;

            const result = await User.where("ID", user.ID).save(user, {
                patch: true
            });
            return result;
        } catch (e) {
            throw e;
        }
    },

    patch: async (id, user) => {
        try {
            // create time no need to update
            delete user.CreateTime;
            const result = await User.where("ID", id).save(user, {
                patch: true
            });
            return result;
        } catch (e) {
            throw e;
        }
    },

    delete: async (id) => {
        try {
            const result = await User.where("ID", id).destroy();
            return result;
        } catch (e) {
            throw e;
        }
    },

    // custom sql query example
    customQueryExample: async (id) => {
        try {
            const result = await knex.raw('SELECT ID, Account, Name FROM User WHERE ID = ? ORDER BY CreateTime', [id]);
            return result;
        } catch (e) {
            throw e;
        }

    },
    // login user
    login: async (account, password) => {
        try {
            // Encrypt Password to compare with db password
            password = _cryptoService.encrypt(password);
            let user = await User.where({
                Account: account,
                Password: password
            }).fetch();
            // user exist, add API Key in Result
            user.set('Key', process.env.API_KEY);
            return user;
        } catch (e) {
            if (e.message == 'EmptyResponse') e.message = '帳號或密碼錯誤';
            throw e;
        }
    }
}