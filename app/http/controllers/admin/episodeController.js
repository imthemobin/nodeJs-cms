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
    res.render("admin/episodes/create", { courses: courses });
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
      this.updateCourseTime(req.body.course);

      return res.redirect("/admin/episodes");
    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      let episode = await Episode.findById(req.params.id);

      if (!episode) {
        this.error("چنین ویدیو ای وجود ندارد", 404);
      }

      let courseId = episode.course;

      //delete episode
      await episode.deleteOne({});

      // update time course
      this.updateCourseTime(courseId);

      res.redirect("/admin/episodes");
    } catch (error) {
      next(error);
    }
  }

  async edit(req, res, next) {
    try {
      this.isMongoId(req.params.id);
      let episode = await Episode.findById(req.params.id);
      let courses = await Course.find();

      if (!episode) {
        this.error("چنین ویدوی ای وجود ندارد", 404);
      }

      res.render("admin/episodes/edit", { episode: episode, courses: courses });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      let result = await this.validationData(req);

      if (!result) {
        return this.back(req, res);
      }

      //update episode
      let episode = await Episode.findByIdAndUpdate(req.params.id, {
        $set: { ...req.body },
      });

      // update time course

      // prev course time update
      this.updateCourseTime(episode.course);
      // now course time update
      this.updateCourseTime(req.body.course);

      //redirect back
      return res.redirect("/admin/episodes");
    } catch (error) {
      next(error);
    }
  }

  async updateCourseTime(coursId) {
    let course = await Course.findById(coursId);
    let episodes = await Episode.find({ course: coursId });

    course.time = this.getTime(episodes);

    await course.save();
    return episodes;
  }
}

module.exports = new episodeController();
