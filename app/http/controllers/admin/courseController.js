const controller = require("app/http/controllers/controller");
const Course = require("app/models/course");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

class courseController extends controller {
  async index(req, res) {
    let page = req.query.page || 1;

    let courses = await Course.paginate(
      {},
      { page: page, sort: { createdAt: 1 }, limit: 1 }
    );

    res.render("admin/courses/index", { title: "دوره ها", courses: courses });
  }

  create(req, res) {
    res.render("admin/courses/create");
  }

  async store(req, res) {
    let result = await this.validationData(req);

    if (!result) {
      //if error exist in form image dont created
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return this.back(req, res);
    }

    // create course

    let newCourse = new Course({
      user: req.user._id,
      title: req.body.title,
      slug: this.slug(req.body.title),
      body: req.body.body,
      type: req.body.type,
      price: req.body.price,
      images: this.imageResize(req.file),
      tumb: this.imageResize(req.file)[480],
      tags: req.body.tags,
    });

    await newCourse.save();

    return res.redirect("/admin/courses");
  }

  async destroy(req, res) {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.json("چنین دوره ای وحود ندارد");
    }

    // delete episode

    // delete images

    Object.values(course.images).forEach((image) =>
      fs.unlinkSync(`./public${image}`)
    );

    //delete course
    await course.deleteOne({})

    res.redirect("/admin/courses")
  }

  slug(title) {
    return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, "-");
  }

  imageResize(image) {
    const imageInfo = path.parse(image.path);

    let addresImage = {};

    addresImage["original"] = this.getUrlImage(
      `${image.destination}/${image.filename}`
    );

    const resize = (size) => {
      let imageName = `${imageInfo.name}-${size}${imageInfo.ext}`;

      addresImage[size] = this.getUrlImage(`${image.destination}/${imageName}`);

      sharp(image.path)
        .resize(size, null)
        .toFile(`${image.destination}/${imageName}`);
    };

    [1080, 720, 480].map(resize);

    return addresImage;
  }

  getUrlImage(dir) {
    return dir.substring(8);
  }
}

module.exports = new courseController();
