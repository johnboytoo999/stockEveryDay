require('dotenv').config();
var crypto = require('crypto');
var encryptMethod = process.env.ENCRYPT_METHOD; // 加密方式
var secret = process.env.ENCRYPT_SECRET; // 加密的依據

//加密
exports.encrypt = function(str) {
    var cipher = crypto.createCipher(encryptMethod, secret);
    var enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
}

//解密
exports.decrypt = function(str) {
    var decipher = crypto.createDecipher(encryptMethod, secret);
    var dec = decipher.update(str, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}