const controller = require("app/http/controllers/controller");
const Course = require("app/models/course");

class courseController extends controller {
  index(req, res) {
    res.render("admin/courses/index", { title: "دوره ها" });
  }

  create(req, res) {
    res.render("admin/courses/create");
  }

  async store(req, res) {
    let result = await this.validationData(req);

    if (!result) {
      return this.back(req, res);
    }


    // uplode image

    // create course

    let newCourse = new Course({
      user: req.user._id,
      title: req.body.title,
      slug: this.slug(req.body.title),
      body: req.body.body,
      type: req.body.type,
      price: req.body.price,
      images: req.body.images,
      tags: req.body.tags,
    });

    await newCourse.save();

    return res.redirect("/admin/courses");
  }

  slug(title) {
    return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g , "-")
}
}

module.exports = new courseController();
