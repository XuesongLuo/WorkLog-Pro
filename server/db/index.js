// server/db/index.js
const mysqlPool = require('./mysql');
const getMongoDb = require('./mongo');
module.exports = { mysqlPool, getMongoDb };