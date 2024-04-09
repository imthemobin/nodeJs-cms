const controller = require("app/http/controllers/controller");
const User = require("app/models/user");
const Role = require("app/models/role");
const bcrypt = require("bcrypt");

class userController extends controller {
  async index(req, res, next) {
    try {
      let page = req.query.page || 1;

      let users = await User.paginate(
        {},
        { page: page, sort: { createdAt: 1 }, limit: 20 }
      );

      res.render("admin/users/index", {
        title: "کاربران",
        users: users,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      res.render("admin/users/create",);
    } catch (error) {
      next(error)
    }
  }

  async addrole(req,res,next){
    try {
      this.isMongoId(req.params.id);

      let user = await User.findById(req.params.id);

      if (!user) {
        this.error("چنین کاربری وجود ندارد", 404);
      }

      let roles = await Role.find({})

      res.render("admin/users/addrole", {user:user, roles:roles})
    } catch (error) {
      next(error)
    }
  }

  async storeAddForUser(req,res,next){
    try {
      this.isMongoId(req.params.id);

      let user = await User.findById(req.params.id);

      if (!user) {
        this.error("چنین کاربری وجود ندارد", 404);
      }

      user.roles = req.body.roles;

      await user.save()

      res.redirect("/admin/users")
    } catch (error) {
      next(error)
    }
  }

  async store(req, res, next) {
    try {
      let result = await this.validationData(req);

      if (!result) {
        return this.back(req, res);
      }

      let existingUser = await User.findOne({email : req.body.email});

      if (existingUser) {
        return this.error("چنین کاربری قبلا ثبت نام کرده است", 404);
      }

      let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
      });

      await newUser.save();

      return res.redirect("/admin/users");
    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      let user = await User.findById(req.params.id)
        .populate({
          path: "courses",
          populate: ["episodes"],
        })
        .exec();

      if (!user) {
        this.error("چنین کاربری وجود ندارد", 404);
      }

      user.courses.forEach(async (course) => {
        course.episodes.forEach(async (episode) => await episode.deleteOne({}));
        await course.deleteOne({});
      });

      //delete user
      await user.deleteOne({});

      res.redirect("/admin/users");
    } catch (error) {
      next(error);
    }
  }

  async edit(req, res, next) {
    try {
      this.isMongoId(req.params.id);
      let user = await User.findById(req.params.id);

      if (!user) {
        this.error("چنین کاربری وجود ندارد", 404);
      }

      res.render("admin/users/edit", {
        user:user
      });
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

      //update user
      let user = await User.findByIdAndUpdate(req.params.id, {
        $set: {
          name: req.body.newName,
          email: req.body.newEmail,
          password: bcrypt.hashSync(req.body.newPassword, 10),
        },
      });

      //redirect back
      return res.redirect("/admin/users");
    } catch (error) {
      console.log(error)
      next(error);
    }
  }


  async toggleadmin(req, res, next) {
    try {
      this.isMongoId(req.params.id);

      let user = await User.findById(req.params.id);

      if (!user) {
        this.error("چنین کاربری وجود ندارد", 404);
      }
      user.isAdmin = !user.isAdmin;

      await user.save();

      this.back(req, res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new userController();
