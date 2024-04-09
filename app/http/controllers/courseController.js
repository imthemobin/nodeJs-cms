const controller = require("app/http/controllers/controller");
const Episode = require("app/models/episode");
const Course = require("app/models/course");
const Category = require("app/models/category");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const request = require("request-promise");
const Payment = require("app/models/payment");
const striptags = require('striptags');

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
      let category = await Category.findOne({ slug: req.query.category });
      if (category) {
        query.categories = { $in: [category._id] };
      }
    }

    let courses = Course.find({ ...query });

    if (req.query.order) {
      courses.sort({ createdAt: -1 });
    }

    courses = await courses.exec();

    let categories = await Category.find();

    res.render("home/courses", { courses, categories, striptags });
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

    let categories = await Category.find({ parent: null })
      .populate("childs")
      .exec();

    res.render("home/single-course", {
      course: course,
      categories: categories,
    });
  }

  async payment(req, res, next) {
    try {
      this.isMongoId(req.body.course);

      let course = await Course.findById(req.body.course);

      if (!course) {
        return this.alertAndBack(req, res, {
          title: "دقت کنید",
          message: "چنین دوره ای یافت نشد",
          type: "error",
        });
      }

      if (req.user.checkLearning(course)) {
        return this.alertAndBack(req, res, {
          title: "دقت کنید",
          message: "شما قبلا در این دوره ثبت نام کرده اید",
          type: "error",
          button: "خیلی خوب",
        });
      }

      if (
        course.price == 0 &&
        (course.type == "vip" || course.type == "free")
      ) {
        return this.alertAndBack(req, res, {
          title: "دقت کنید",
          message:
            "این دوره مخصوص اعضای ویژه یا رایگان است و قابل خریداری نیست",
          type: "error",
          button: "خیلی خوب",
        });
      }

      // buy proccess
      let params = {
        merchant_id: "f83cc956-f59f-11e6-889a-005056a205be",
        amount: course.price,
        callback_url: "http://localhost:3000/courses/payment/checker",
        description: `بابت خرید دوره ${course.title}`,
        email: req.user.email,
      };
      let options = this.getUrlOption(
        "https://api.zarinpal.com/pg/v4/payment/request.json",
        params
      );

      request(options)
        .then(async (data) => {
          let payment = new Payment({
            user: req.user._id,
            course: course._id,
            ressNumber: data.data.authority,
            price: course.price,
          });

          await payment.save();

          res.redirect(
            `https://www.zarinpal.com/pg/StartPay/${data.data.authority}`
          );
        })
        .catch((err) => res.json(err.message));
    } catch (error) {
      next(error);
    }
  }

  async checker(req, res, next) {
    try {
      // if(req.query.Status && req.query.Status !== "OK"){
      //   return this.alertAndBack(req,res,{
      //     title: "دقت کنید",
      //     message: "پرداخت شما با موفقیت انجام نشد"
      //   })
      // }

      let payment = await Payment.findOne({ ressNumber: req.query.Authority })
        .populate("course")
        .exec();

      if (!payment.course) {
        return this.alertAndBack(req, res, {
          title: "دقت کنید",
          message: "پرداخت شما با موفقیت انجام نشد",
          type: "error",
        });
      }
      // ******test for payment is work*******
      payment.payment = true;
      req.user.learning.push(payment.course._id);

      await payment.save();
      await req.user.save();

      this.alert(req, {
        title: "با تشکر",
        message: "عملیات مورد نظر با موفقیت انجام شد",
        type: "success",
        button: "بسیار خوب",
      });

      res.redirect(payment.course.path());
      // ******test for payment is work*******

      let params = {
        merchant_id: "f83cc956-f59f-11e6-889a-005056a205be",
        amount: payment.course.price,
        authority: req.query.Authority,
      };

      let options = this.getUrlOption(
        "https://api.zarinpal.com/pg/v4/payment/verify.json",
        params
      );

      request(options)
        .then(async (data) => {
          if (data.Status == 100) {
            payment.payment = true;
            req.user.learning.push(payment.course._id);

            await payment.save();
            await req.user.save();

            this.alert(req, {
              title: "با تشکر",
              message: "عملیات مورد نظر با موفقیت انجام شد",
              type: "success",
              button: "بسیار خوب",
            });

            res.redirect(payment.course.path());
          } else {
            this.alertAndBack(req, res, {
              title: "دقت کنید",
              message: "پرداخت شما با موفقیت انجام نشد",
              type: "error",
            });
          }
        })
        .catch((err) => {
          next(err);
        });
    } catch (error) {
      next(error);
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

  getUrlOption(url, params) {
    return {
      method: "POST",
      uri: url,
      headers: {
        "cache-control": "no-cache",
        "content-type": "application/json",
      },
      body: params,
      json: true,
    };
  }
}

module.exports = new courseController();
