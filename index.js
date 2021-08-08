require('dotenv').config();
// Require the fastify framework and instantiate it
const fastify = require('fastify')({
  logger: true
})


// Import Routes
const routes = require('./routes')

// Import Swagger Options
const swagger = require('./config/swagger')

//Import node-cron
const cron = require('node-cron');
// Get Data Models
const stockService = require('./services/stock.service');


// Register Swagger
fastify.register(require('fastify-swagger'), swagger.options)
fastify.register(require('fastify-cors'), { 
  // put your options here
  origin: false
});
// Register Schema Validator
const schemaCompiler = require('./config/validator');
fastify.setSchemaCompiler(schemaCompiler);

// Loop over each route
routes.forEach((route, index) => {
  fastify.route(route)
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(process.env.PORT, '0.0.0.0')
    fastify.swagger()
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start();

cron.schedule('0 14 * * *', async() => {
  console.log('running a task every day ');
  try {
    
    const stocks = await stockService.UpdateGuess();
    console.log(stocks);
  } catch (e) {
    
    console.log(e);
  }
  
});