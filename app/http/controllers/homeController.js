const controller = require("app/http/controllers/controller");
const User = require("app/models/user");
const Course = require("app/models/course");

class homeController extends controller {
  async index(req, res) {

    // ******test virtual*******
    // let user = await User.findById("65d1105dbf3d7dda728eb9a4").populate("courses").exec();
    // return res.json(user);
    
    let courses = await Course.find({}).sort({createdAt: 1}).limit(8).exec()

    res.render("home/index", {courses: courses});
  }

  async about(req, res) {
    res.render("home/about");
  }
}

module.exports = new homeController();
