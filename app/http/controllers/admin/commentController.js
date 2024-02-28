const controller = require("app/http/controllers/controller");
const Comment = require("app/models/comment");

class courseController extends controller {
  async index(req, res, next) {
    try {
      let page = req.query.page || 1;

      let comments = await Comment.paginate(
        { approved: true },
        {
          page: page,
          sort: { createdAt: -1 },
          limit: 10,
          populate: [
            {
              path: "user",
              select: "name",
            },
            "course",
            {
              path: "episode",
              populate: [
                {
                  path: "course",
                  select: "slug",
                },
              ],
            },
          ],
        }
      );
      res.render("admin/comments/index", {
        title: "کامنت ها",
        comments: comments,
      });
    } catch (error) {
      next(error);
    }
  }

  async approved(req, res, next) {
    try {
      let page = req.query.page || 1;

      let comments = await Comment.paginate(
        { approved: false },
        {
          page: page,
          sort: { createdAt: -1 },
          limit: 10,
          populate: [
            {
              path: "user",
              select: "name",
            },
            "course",
            {
              path: "episode",
              populate: [
                {
                  path: "course",
                  select: "slug",
                },
              ],
            },
          ],
        }
      );
      res.render("admin/comments/approved", {
        title: "کامنت ها",
        comments: comments,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      this.isMongoId(req.params.id);
      let comment = await Comment.findById(req.params.id).populate('belongTo').exec()

      if (!comment) {
        return res.json("چنین کامنتی وجود ندارد");
      }



      await comment.belongTo.inc('commentCount');

      comment.approved = true;

      await comment.save();

      return this.back(req, res);
    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      this.isMongoId(req.params.id);
      let comment = await Comment.findById(req.params.id);

      if (!comment) {
        return res.json("چنین کامنتی وجود ندارد");
      }
      //delete comment
      await comment.deleteOne({});

      return this.back(req, res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new courseController();
