const controller = require("app/http/controllers/controller");
const Payment = require("app/models/payment");
const Course = require("app/models/course");

class userController extends controller {
  async index(req, res, next) {
    try {
      res.render("home/panel/index",{title: "پنل کاربری"});
    } catch (error) {
      next(error)
    }
  }

  async history(req, res, next) {
    try {
      let page = req.query.page || 1;

      let payments = await Payment.paginate({user : req.user}, {page , sort:{createdAt : -1},populate: "course"})

      res.render("home/panel/history",{title: "پرداختی ها", payments:payments});
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new userController();
