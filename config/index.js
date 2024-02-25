const database = require("./database");
const session = require("./session");
const layouts = require("./layouts");
const service = require("./service");

module.exports = {
  port: process.env.APPLICATON_PORT,
  database: database,
  session: session,
  layouts: layouts,
  service: service,
  cookie_secretkey: process.env.COOKIE_SECRETKEY,
  debug: true,
};
