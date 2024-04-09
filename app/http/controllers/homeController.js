const controller = require("app/http/controllers/controller");
const Comment = require("app/models/comment");
const Course = require("app/models/course");
const Episode = require("app/models/episode");
const sm = require('sitemap');
const rss = require('rss');
const striptags = require('striptags');

class homeController extends controller {
  async index(req, res) {
    // ******test virtual*******
    // let user = await User.findById("65d1105dbf3d7dda728eb9a4").populate("courses").exec();
    // return res.json(user);

    let courses = await Course.find({}).sort({ createdAt: 1 }).limit(8).exec();

    res.render("home/index", { courses: courses ,striptags:striptags});
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

  async sitemap(req, res, next) {
    try {
      let sitemap = sm.createSitemap({
        hostname: config.siteurl,
        // cacheTime : 600000
      });

      sitemap.add({ url: "/", changefreq: "daily", priority: 1 });
      sitemap.add({ url: "/courses", priority: 1 });

      let courses = await Course.find({}).sort({ createdAt: -1 }).exec();
      courses.forEach((course) => {
        sitemap.add({
          url: course.path(),
          changefreq: "weekly",
          priority: 0.8,
        });
      });

      let episodes = await Episode.find({})
        .populate("course")
        .sort({ createdAt: -1 })
        .exec();
      episodes.forEach((episode) => {
        sitemap.add({
          url: episode.path(),
          changefreq: "weekly",
          priority: 0.8,
        });
      });

      res.header("Content-type", "application/xml");
      res.send(sitemap.toString());
    } catch (err) {
      console.log(err)
    }
  }

  async feedCourses(req, res, next) {
    try {
      let feed = new rss({
        title: "فید خوان دوره های مبین لرن",
        description: "جدیدترین دوره ها را از طریق rss بخوانید",
        feed_url: `${config.siteurl}/feed/courses`,
        site_url: config.site_url,
      });

      let courses = await Course.find({})
        .populate("user")
        .sort({ createdAt: -1 })
        .exec();
      courses.forEach((course) => {
        feed.item({
          title: course.title,
          description: striptags(course.body.substr(0, 100)),
          date: course.createdAt,
          url: course.path(),
          author: course.user.name,
        });
      });

      res.header("Content-type", "application/xml");
      res.send(feed.xml());
    } catch (err) {
      next(err);
    }
  }

  async feedEpisodes(req, res, next) {
    try {
      let feed = new rss({
        title: "فید خوان جلسات دوره های های مبین لرن",
        description: "جدیدترین دوره ها را از طریق rss بخوانید",
        feed_url: `${config.siteurl}/feed/courses`,
        site_url: config.site_url,
      });

      let episodes = await Episode.find({})
        .populate({ path: "course", populate: "user" })
        .sort({ createdAt: -1 })
        .exec();
      episodes.forEach((episode) => {
        feed.item({
          title: episode.title,
          description: striptags(episode.body.substr(0, 100)),
          date: episode.createdAt,
          url: episode.path(),
          author: episode.course.user.name,
        });
      });

      res.header("Content-type", "application/xml");
      res.send(feed.xml());
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new homeController();
