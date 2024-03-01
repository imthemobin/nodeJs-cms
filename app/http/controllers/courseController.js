const controller = require("app/http/controllers/controller");
const Episode = require("app/models/episode");
const Course = require("app/models/course");
const Category = require("app/models/category");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

class courseController extends controller {
  async index(req, res) {
    let query = {};

    if (req.query.search) {
      query.title = new RegExp(req.query.search, "gi");
    }

    if (req.query.type && req.query.type != "all") {
      query.type = req.query.type;
    }

    if (req.query.category && req.query.category != "all") {
      let category = await Category.findOne({slug: req.query.category})
      if(category){
        query.categories = {$in:[category._id]}
      }
    }

    let courses = Course.find({ ...query });

    if (req.query.order) {
      courses.sort({ createdAt: -1 });
    }

    courses = await courses.exec();

    let categories = await Category.find();

    res.render("home/courses", { courses , categories});
  }

  async single(req, res) {
    // find course and update view count
    let course = await Course.findOneAndUpdate(
      { slug: req.params.course },
      { $inc: { viewCount: 1 } }
    )
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
              populate: { path: "user", select: "name" },
            },
          ],
        },
      ]);


    let  categories = await Category.find({parent: null}).populate("childs").exec()


    res.render("home/single-course", {
      course: course,
      categories:categories
    });
  }

  async payment(req,res,next){
    try {
      this.isMongoId(req.body.course)

      let course = await Course.findById(req.body.course)

      if(! course){
        console.log("not found")
      }

      if(req.user.checkLearning(course)){
        console.log("شما قبلا این دوره را خرید کرده اید");
        return;
      }

      if(course.price == 0 && (course.type == 'vip'  || course.type == 'free')){
        console.log("این دوره مخصوص اعضای ویژه است و قابل خرید نیست");
      }

      // buy proccess

    } catch (error) {
      next(error)
    }
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

      await episode.inc("downloadCount");

      return res.download(filePath);
    } catch (error) {
      next(error);
    }
  }


  hashCheck(req, episode) {
    let timestamps = new Date().getTime();

    if (req.query.t < timestamps) return false;

    let text = `QW7F!@#!@3!@!@U8&*^#%TF${episode._id}${req.query.t}`;

    return bcrypt.compareSync(text, req.query.mac);
  }
}

module.exports = new courseController();
