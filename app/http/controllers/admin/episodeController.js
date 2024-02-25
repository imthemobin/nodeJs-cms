const controller = require("app/http/controllers/controller");
const Course = require("app/models/course");
const Episode = require("app/models/episode");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

class episodeController extends controller {
  async index(req, res, next) {
    try {
      let page = req.query.page || 1;

      let episodes = await Episode.paginate(
        {},
        { page: page, sort: { createdAt: 1 }, limit: 1 }
      );

      res.render("admin/episodes/index", {
        title: "ویدیو ها",
        episodes: episodes,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res) {
    let courses = await Course.find();
    res.render("admin/episodes/create",{courses: courses});
  }

  async store(req, res, next) {
    try {
      let result = await this.validationData(req);

      if (!result) {
        return this.back(req, res);
      }

      // create episode

      let newEpisode = new Episode({ ...req.body });

      await newEpisode.save();

      // update time course

      return res.redirect("/admin/episodes");
    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      let episode = await Episode.findById(req.params.id);

      if (!episode) {
        this.error('چنین ویدیو ای وجود ندارد' , 404);
      }

      //delete episode
      await episode.deleteOne({});

      res.redirect("/admin/episodes");
    } catch (error) {
      next(error);
    }
  }

  async edit(req, res, next) {
    try {
      this.isMongoId(req.params.id);
      let course = await Course.findById(req.params.id);

      if (!course) {
        this.error("چنین دوره ای وجود ندارد", 404);
      }

      res.render("admin/courses/edit", { course });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      let result = await this.validationData(req);

      if (!result) {
        //if error exist in form image dont created
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return this.back(req, res);
      }

      let objectForUpdate = {};

      //set thumbnail

      objectForUpdate.thumb = req.body.imagesThumb;

      //check image
      if (req.file) {
        objectForUpdate.images = this.imageResize(req.file);
        objectForUpdate.thumb = objectForUpdate.images[480];
      }

      delete req.body.images;

      //change slug
      objectForUpdate.slug = this.slug(req.body.title);

      //update course
      await Course.findByIdAndUpdate(req.params.id, {
        $set: { ...req.body, ...objectForUpdate },
      });

      //redirect back

      return res.redirect("/admin/courses");
    } catch (error) {
      next(error);
    }
  }

  slug(title) {
    return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, "-");
  }
}

module.exports = new episodeController();
