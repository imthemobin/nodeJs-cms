const express = require("express");
const app = express();
const http = require("http");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const validator = require("express-validator");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const Helper = require('./helper')
const rememberLogin = require('app/http/middlewares/rememberLogin')

module.exports = class Application {
  constructor() {
    this.setupExpress();
    this.setupMongoConnections();
    this.setupConfig();
    this.setupRouter();
  }

  setupExpress() {
    const server = http.createServer(app);
    server.listen(config.port, () => console.log(`you are listening to port: ${config.port} `));
  }

  setupMongoConnections() {
    mongoose
      .connect(config.database.url)
      .then(() => console.log("connect successfully to mongo"))
      .catch(() => console.log("fail to connect mongo"));
  }

  setupConfig() {
    // for find "local.***" in app
    require("app/passport/passport-local");

    app.use(express.static(config.layouts.public_dir));
    app.set("view engine", config.layouts.view_engine);
    app.set("views", config.layouts.view_dir);

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(validator());

    app.use(
      session({
       ...config.session
      })
    );

    app.use(cookieParser(config.cookie_secretkey));
    app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(rememberLogin.handler)
    app.use((req, res, next) => {
      app.locals = new Helper(req,res).getObject()
      next()
    });
  }

  setupRouter() {
    app.use(require("app/routes/web/index"));
    app.use(require("app/routes/api/index"));
  }
};
