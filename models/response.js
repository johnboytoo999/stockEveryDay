const boom = require('@hapi/boom');

var response = function (statusCode, data, message) {
    this.statusCode = statusCode; // 呼叫API => 回傳狀態成功或失敗  true or false
    this.data = data; // 呼叫API => 回傳的資料
    this.message = message; // 呼叫API => 回傳的訊息
}
module.exports = {
    /**
     * 成功呼叫API的回傳資料結構
     */
    SUCCESS: (data, message = '呼叫API成功') => {
        return new response(200, data, message);
    },
    /**
     * 呼叫API失敗的回傳資料結構
     */
    FAIL: (err) => {
        return boom.boomify(err);
    },
    /**
     * 客製化回傳的狀態、資料、訊息
     */
    DATA: (statusCode, data, message) => {
        return new response(statusCode, data, message);
    }
}