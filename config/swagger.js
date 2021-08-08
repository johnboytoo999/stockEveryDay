require('dotenv').config();
exports.options = {
  routePrefix: '/documentation',
  exposeRoute: true,
  swagger: {
    info: {
      title: '每日猜股 API',
      description: '每日猜股 API',
      version: '1.0.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    host: `${process.env.HOST}:${process.env.PORT}`,
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  }
}
