const controller = require("app/http/controllers/controller");
const Episode = require("app/models/episode");
const Course = require("app/models/course");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

class courseController extends controller {
  async index(req, res) {
    res.render("home/courses");
  }

  async single(req, res) {
    // find course and update view count
    let course = await Course.findOneAndUpdate({ slug: req.params.course }, {$inc : {viewCount: 1}})
      .populate([
        { path: "user", select: "name" },
        {
          path: "episodes",
          options: {
            sort: { number: 1 },
          },
        },
      ])
      .populate([
        {
          path: "comments",
          match: {
            parent: null,
            approved: true,
          },
          populate: [
            {
              path: "user",
              select: "name",
            },
            {
              path: "comments",
              match: {
                approved: true,
              },
              populate : {path : "user", select: "name"}
            },
          ],
        },
      ]);

    let canUserUse = await this.canUse(req, course);

    res.render("home/single-course", {
      course: course,
      canUserUse: canUserUse,
    });
  }

  async download(req, res, next) {
    try {
      this.isMongoId(req.params.episode);

      let episode = await Episode.findById(req.params.episode);

      if (!episode) this.error("چنین قایلی برای این جلسه وجود ندارد", 404);

      if (!this.hashCheck(req, episode))
        this.error("اعتبار لینک به پایان رسیده است", 403);

      let filePath = path.resolve(
        `./public/downloads/HKJHGHJ5654S/${episode.videoUrl}`
      );

      if (!fs.existsSync(filePath))
        this.error("چنین فایلی برای دانلود وجود ندارد", 404);


      await episode.inc("downloadCount")

      return res.download(filePath);
    } catch (error) {
      next(error);
    }
  }

  async canUse(req, course) {
    let canUse = false;

    if (req.isAuthenticated()) {
      switch (course.type) {
        case "vip":
          canUse = req.user.isVip();
          break;

        case "cash":
          canUse = req.user.checkLearning(course);
          break;

        default:
          canUse = true;
          break;
      }
    }
    return canUse;
  }

  hashCheck(req, episode) {
    let timestamps = new Date().getTime();

    if (req.query.t < timestamps) return false;

    let text = `QW7F!@#!@3!@!@U8&*^#%TF${episode._id}${req.query.t}`;

    return bcrypt.compareSync(text, req.query.mac);
  }
}

module.exports = new courseController();
