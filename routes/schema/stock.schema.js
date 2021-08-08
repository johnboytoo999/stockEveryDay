// option = {
//     summary: '',
//     params: {},
//     body: {},
//     isNeedLogin: true
// }

module.exports = function (option) {
    let schemaBody;
    // 預設的user body
    if (option.body == 'guess') {
        schemaBody = {
            type: 'object',
            properties: {              
                userID: {
                    type: 'number',
                    validator : [(value) => value != '', _ => '不能為空白'],
                },
                value: {
                    type: 'string',
                    maxLength: 1,
                    validator : [(value) => value != '', _ => '不能為空白'],                
                },
            },
            required: [ 'userID', 'value']
        }
    }
    else  if (option.body == 'userMessage') {
        schemaBody = {
            type: 'object',
            properties: {              
                userID: {
                    type: 'number',
                    validator : [(value) => value != '', _ => '不能為空白'],
                },
                message: {
                    type: 'string',
                    maxLength: 10000,
                    validator : [(value) => value != '', _ => '不能為空白'],                
                },
            },
            required: ['userID', 'message']
        }
    }
    // 客製化body
    else {
        schemaBody = option.body;
    }
    // login header with api key
    const schemaHeader = {
        type: 'object',
        properties: {
            'api-key': {
                type: 'string'
            },
        },
        required: ['api-key']
    }
    const schema = {
        description: option.summary,
        tags: ['Stock'],
        summary: option.summary,
        params: option.params,
        body: schemaBody,
        headers: schemaHeader,
    }

    // 不需要body
    if (option.body == '' || typeof option.body === 'undefined') {
        delete schema.body;
    }

    // 不需要登入 => isNeedLogin = false, 其餘預設需要登入
    if (option.isNeedLogin === false) {
        delete schema.headers;
    }

    return schema;

};