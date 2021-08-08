// Step 1, create new AJV instance and register new keyword which will vaidate all type of schema
const Ajv = require('ajv');
const ajv = new Ajv({
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true
});
ajv.addKeyword('validator', {
    compile: (schema, parentSchema) => function validate(data) {
        if (typeof schema === 'function') {
            const valid = schema(data);
            if (!valid) {
                validate.errors = [{
                    keyword: 'validate',
                    message: `: ${data} should pass custom validation`,
                    params: {
                        keyword: 'validate'
                    },
                }];
            }
            return valid;
        } else if (typeof schema === 'object' &&
            Array.isArray(schema) &&
            schema.every(f => typeof f === 'function')) {
            const [f, errorMessage] = schema;
            const valid = f(data);
            if (!valid) {
                validate.errors = [{
                    keyword: 'validate',
                    message: ': ' + errorMessage(schema, parentSchema, data),
                    params: {
                        keyword: 'validate'
                    },
                }];
            }
            return valid;
        } else {
            throw new Error('Invalid definition for custom validator');
        }
    },
    errors: true,
});

module.exports = ajv.compile.bind(ajv);