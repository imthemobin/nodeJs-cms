const controller = require("app/http/controllers/controller");
const Course = require("app/models/course");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

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
      //if error exist in form image dont created
      if (req.file) {
        fs.unlink(req.file.path, (error) => {});
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
      images: JSON.stringify(this.imageResize(req.file)),
      tags: req.body.tags,
    });

    await newCourse.save();

    return res.redirect("/admin/courses");
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
