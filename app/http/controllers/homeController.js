const controller = require("app/http/controllers/controller");
const Comment = require("app/models/comment");
const Course = require("app/models/course");

class homeController extends controller {
  async index(req, res) {
    // ******test virtual*******
    // let user = await User.findById("65d1105dbf3d7dda728eb9a4").populate("courses").exec();
    // return res.json(user);

    let courses = await Course.find({}).sort({ createdAt: 1 }).limit(8).exec();

    res.render("home/index", { courses: courses });
  }

  async about(req, res) {
    res.render("home/about");
  }

  async comment(req, res, next) {
    try {
      let result = await this.validationData(req);

      if (!result) {
        return this.back(req, res);
      }

      let newComment = new Comment({
        user: req.user._id,
        ...req.body,
      });

      await newComment.save();

      return this.back(req, res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new homeController();
