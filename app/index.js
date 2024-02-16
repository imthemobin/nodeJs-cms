const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const validator = require("express-validator");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const flash = require("connect-flash");
const mongoose = require("mongoose");

module.exports = class Application {
  constructor() {
    this.setupExpress();
    this.setupMongoConnections()
    this.setupConfig();
    this.setupRouter()
  }

  setupExpress() {
    const server = http.createServer(app);
    server.listen(3000, () => console.log("you are listening to port: 3000"));
  }

  setupMongoConnections() {
    mongoose
      .connect("mongodb://localhost:27017/nodejs")
      .then(() => console.log("connect successfully to mongo"))
      .catch(() => console.log("fail to connect mongo"));
  }

  setupConfig() {
    // for find "local.***" in app
    require('app/passport/passport-local')

    app.use(express.static("public"));
    app.set("view engine", "ejs");
    app.set("views", path.resolve("resource/views"));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(validator());

    app.use(
      session({
        secret: "xxxxxxxxxxxxxxx",
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
      })
    );

    app.use(cookieParser("xxxxxxxxxxxxxx"));
    app.use(flash());

    app.use(passport.initialize())
    app.use(passport.session())

  }

  setupRouter(){
    app.use(require('app/routes/web/index'))
    app.use(require('app/routes/api/index'))
  }
};
