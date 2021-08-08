require('dotenv').config()

const TodayStock = require('../models/todayStock');
const Message = require('../models/message');
const MessageReply = require('../models/messageReply');
const Guess = require('../models/guess');
const Taiex = require('../models/taiex');
// If need custom query, import knex
const knex = require('../config/knexfile');
const moment = require('moment-timezone');
const request = require('request');
module.exports = {

    getToday: async (userID) => {

        try {
            const Today = {};
            // 取得台北時區現在時間
            let now = moment().tz("Asia/Taipei").format();

            var result = await knex.raw('select  *,(select Value from Guess where TodayStockID = A.ID and UserID = ?) AS Guess ' +
                'from TodayStock A Where now() between StartDate and EndDate', [userID]);
            Today.Stock = result[0];
            Today.Taiex = await Taiex.where("StartDate", "<", now).where("EndDate", ">=", now).fetch();
            return Today;
        } catch (e) {
            if (e.message == 'EmptyResponse') e.message = '目前無每日股票';
            throw e;
        }
    },
    getMessage: async (id) => {

        try {
            //const message = await Message.where('TodayStockID', id).fetchAll();   

            const result = await knex.raw('select A.ID,A.UserID,A.TodayStockID,A.Message,A.CreateTime,C.Name,C.Avatar,' +
                '(select count(*) from MessageReply where MessageID = A.ID) AS ReplyCount from Message A ' +
                'left join TodayStock B ' +
                'on A.TodayStockID = B.ID ' +
                'left join User C ' +
                'on A.USERID = C.ID ' +
                'Where B.StockCode = (select StockCode from TodayStock where ID = ?) order by A.CreateTime desc', [id]);

            result[0].forEach(element => {
                console.log(element.CreateTime);
                element.CreateTime = msgDateDiff(element.CreateTime)
            });
            return result[0];
        } catch (e) {
            throw e;
        }
    },

    getMessageByMessageID: async (id) => {

        try {
            //const message = await Message.where('TodayStockID', id).fetchAll();   

            const result = await knex.raw('select A.ID,A.UserID,A.TodayStockID,A.Message,A.CreateTime,C.Name,C.Avatar,' +
                '(select count(*) from MessageReply where MessageID = A.ID) AS ReplyCount from Message A ' +
                'left join TodayStock B ' +
                'on A.TodayStockID = B.ID ' +
                'left join User C ' +
                'on A.USERID = C.ID ' +
                'Where A.ID = ? order by A.CreateTime desc', [id]);
            console.log(result);

            result[0].forEach(element => {
                console.log(element.CreateTime);
                element.CreateTime = msgDateDiff(element.CreateTime)
            });
            return result[0];
        } catch (e) {
            throw e;
        }
    },
    getMessageReply: async (id) => {

        try {
            const message = await knex.raw('select A.ID,A.UserID,A.MessageReply,A.CreateTime,C.Name,C.Avatar ' +
                'from MessageReply A ' +
                'left join User C ' +
                'on A.USERID = C.ID ' +
                'Where A.MessageID = ? order by A.CreateTime desc', [id]);

            // message[0].forEach(element => {
            //     // console.log(element.CreateTime);
            //     element.CreateTime = msgDateDiff(element.CreateTime)
            // });
            return message[0].map(element => {
                // console.log(element.CreateTime);
                element.CreateTime = msgDateDiff(element.CreateTime);
                return element;
            });
        } catch (e) {
            //fetchAll 可null
            //if (e.message == 'EmptyResponse') e.message = '目前無回復';
            throw e;
        }
    },

    getMessageReplyByMessageReplyID: async (id) => {

        try {
            const message = await knex.raw('select A.ID,A.UserID,A.MessageReply,A.CreateTime,C.Name,C.Avatar ' +
                'from MessageReply A ' +
                'left join User C ' +
                'on A.USERID = C.ID ' +
                'Where A.ID = ? order by A.CreateTime desc', [id]);


            return message[0].map(element => {
                // console.log(element.CreateTime);
                element.CreateTime = msgDateDiff(element.CreateTime);
                return element;
            });
        } catch (e) {
            throw e;
        }
    },

    getGuess: async (id) => {

        try {
            const message = await Guess.where('TodayStockID', id).fetchAll();
            return message;
        } catch (e) {
            if (e.message == 'EmptyResponse') e.message = '目前無任何猜測';
            throw e;
        }
    },

    guessStock: async (req) => {


        if (new Date().getHours() < 14 && moment().tz("Asia/Taipei").day() != 0 && moment().tz("Asia/Taipei").day() != 6) {
            return ("猜測時間為14:00~11:59,假日全天");
        }

        const check = await Guess.where({
            UserID: req.body.userID,
            TodayStockID: req.params.stockID
        }).count();
        if (check > 0) {
            return ("您已經猜測過了");
        }
        console.log(check);
        try {
            const result = await Guess.forge({
                UserID: req.body.userID,
                TodayStockID: req.params.stockID,
                Value: req.body.value
            }).save();
            console.log(result);
            return result;
        } catch (e) {
            throw e;
        }
    },

    leaveMessage: async (req) => {

        try {
            const result = await Message.forge({
                UserID: req.body.userID,
                TodayStockID: req.params.stockID,
                Message: req.body.message
            }).save();
            console.log(result);
            var reuturnResult = module.exports.getMessageByMessageID(result.id);
            return reuturnResult;
            
           // return result;
        } catch (e) {
            throw e;
        }
    },


    replyMessage: async (req) => {
        try {
            const result = await MessageReply.forge({
                UserID: req.body.userID,
                MessageID: req.params.messageID,
                MessageReply: req.body.message
            }).save();
            var reuturnResult = module.exports.getMessageReplyByMessageReplyID(result.id);
            return reuturnResult;
          //  return result;
        } catch (e) {
            throw e;
        }
    },

    GuessHistory: async (userID) => {
        try {
            const result = {};
            var history = await knex.raw('select A.ID, A.UserID, A.Value, A.Result, A.CreateTime, A.TodayStockID,B.StockCode,B.StockName from Guess A left join TodayStock B on A.TodayStockID = B.ID where userID = ?', [userID]);
            var win = await knex.raw('select count(*)	As win from Guess where  value = Result and userID =? ', [userID]);
            var totalGuess = await knex.raw('select  count(*) As totalGuess from Guess where userId = ? and Result is not null', [userID]);
            result.History = history[0];
            result.win = win[0][0].win;
            result.totalGuess = totalGuess[0][0].totalGuess;
            return result;
        } catch (e) {
            throw e;
        }
    },

    GuessHistory: async (userID) => {
        try {
            const result = {};
            var history = await knex.raw('select A.ID, A.UserID, A.Value, A.Result, A.CreateTime, A.TodayStockID,B.StockCode,B.StockName from Guess A left join TodayStock B on A.TodayStockID = B.ID where userID = ?', [userID]);
            var win = await knex.raw('select count(*)	As win from Guess where  value = Result and userID =? ', [userID]);
            var totalGuess = await knex.raw('select  count(*) As totalGuess from Guess where userId = ? and Result is not null', [userID]);
            result.History = history[0];
            result.win = win[0][0].win;
            result.totalGuess = totalGuess[0][0].totalGuess;
            return result;
        } catch (e) {
            throw e;
        }
    },

    LeaderBoard: async () => {
        try {

            var result = await knex.raw('select   A.ID , A.Name, A.Avatar,(select   count(*)	from Guess where userId = A.ID and Result = value) /' +
                '(select   count(*)	 from Guess where 	userId = A.ID and Result is not null)  AS winRate from User A ' +
                'where (select   count(*)	 from Guess where 	userId = A.ID and Result is not null) <> 0');

            return result[0];
        } catch (e) {
            throw e;
        }
    },

    UpdateGuess: async () => {
        //  if (new Date().getHours() < 14 && new Date().getDay() != 0 && new Date().getDay() != 6) {
        //      return ("更新時間需為14:00~11:59,假日全天");
        //  }
        try {
            var stocks = await knex.raw('select StockCode ,ID from TodayStock where   DATEDIFF( NOW(), EndDate ) = 0');
            var guess = {};
            for (let element of stocks[0]) {
                console.log(element.StockCode);

                console.log(element);
                try {
                    let stockRequest = await getStockRequest(element.StockCode);
                    console.log(stockRequest);

                    var stockResult = stockRequest.data[stockRequest.data.length - 1][7];
                    if (stockResult.includes("+")) {
                        guess.Result = 1;
                    } else if (stockResult.includes("-")) {
                        guess.Result = 0;
                    } else {
                        guess.Result = 2;
                    }
                    const result = await Guess.where("TodayStockID", element.ID).save(guess, {
                        patch: true
                    });
                    console.log(result);
                } catch (err) {
                    console.log(err);
                    throw err;
                }
            }

            return ("已更新");
        } catch (e) {
            throw e;
        }
    },

    InsertTodayStock: async (stockCode) => {
        //  if (new Date().getHours() < 14 && new Date().getDay() != 0 && new Date().getDay() != 6) {
        //      return ("更新時間需為14:00~11:59,假日全天");
        //  }
        try {

            let stockRequest = await getStockRequest(stockCode);
            console.log(stockRequest);
            var stockResult = {};  
            var stockName =stockRequest.title.split(' ');
            stockResult.StockCode = stockCode;
            stockResult.StockName = stockName[2]; 
            stockResult.StartDate =   moment().format('YYYY-MM-DD HH:mm:ss');

            var days = moment().Date() == 4 ? 3 : 1;
            stockResult.EndDate =  moment().add(days, 'days').format('YYYY-MM-DD HH:mm:ss');

            stockResult.OpeningPrice = stockRequest.data[stockRequest.data.length - 1][3];
            stockResult.ClosingPrice = stockRequest.data[stockRequest.data.length - 1][6]; 
            stockResult.DayHighPrice = stockRequest.data[stockRequest.data.length - 1][4];
            stockResult.DayLowPrice = stockRequest.data[stockRequest.data.length - 1][5];
            stockResult.TradeQuantity = stockRequest.data[stockRequest.data.length - 1][8]; 
            stockResult.TradeAmount = stockRequest.data[stockRequest.data.length - 1][2]; 
            stockResult.PriceSpread = stockRequest.data[stockRequest.data.length - 1][7]; 

            const result = await TodayStock.forge(stockResult).save();
            return result;

        }

        catch (e) {
            throw e;
        }
    },
}



async function getStockRequest(StockCode) {
    let now = moment().tz("Asia/Taipei").format('YYYYMMDD');
    return new Promise(function (resolve, reject) {
        request('https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=' + now + '&stockNo=' + StockCode, {
            json: true
        }, (err, res, body) => {
            if (err) {
                reject(err);
            }
            console.log(body.stat);
            if (body.stat === 'OK') {
                //reject("笑死");
                resolve(body);
            }

        });
    });
}


function msgDateDiff(msgTime) {
    // 

    var timeDiff = Math.floor((moment().tz("Asia/Taipei") - moment(msgTime)) / 1000);
    // console.log(timeDiff);

    if (timeDiff < 60) {
        return timeDiff + "秒前";
    }

    timeDiff = Math.floor(timeDiff / 60);
    if (timeDiff < 60) {
        return timeDiff + "分鐘前";
    }
    timeDiff = Math.floor(timeDiff / 60)

    if (timeDiff < 24) {
        return timeDiff + "小時前";
    }

    timeDiff = Math.floor(timeDiff / 24)
    return timeDiff < 3 ? timeDiff + "天前" : msgTime;
}