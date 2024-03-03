const controller = require("app/http/controllers/controller");
const Permission = require("app/models/permission");


class permissionController extends controller {
  async index(req, res, next) {
    try {
      let page = req.query.page || 1;

      let permissions = await Permission.paginate(
        {},
        { page: page, sort: { createdAt: 1 }, limit: 10}
      );

      res.render("admin/permissions/index", {
        title: "لیست اجازه دسترسی ها ",
        permissions: permissions,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res) {
    res.render("admin/permissions/create",);
  }

  async store(req, res, next) {
    try {
      let result = await this.validationData(req);

      if (!result) {
        return this.back(req, res);
      }

      // create permission

      let newPermission = new Permission({
        name: req.body.name,
        label : req.body.label
      });

      await newPermission.save();

      return res.redirect("/admin/users/permissions");
    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      let permission = await Permission.findById(req.params.id)

      if (!permission) {
        this.error("چنین اجازه دسترسی وجود ندارد", 404);
      }


      //delete permission
      await permission.deleteOne({});

      res.redirect("/admin/users/permissions");
    } catch (error) {
      next(error);
    }
  }

  async edit(req, res, next) {
    try {
      this.isMongoId(req.params.id);
      let permission = await Permission.findById(req.params.id);


      if (!permission) {
        this.error("چنین اجازه دسترسی وجود ندارد", 404);
      }

      res.render("admin/permissions/edit", {
        permission: permission,
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

      //update permission
      let permission = await Permission.findByIdAndUpdate(req.params.id, {
        $set: {
          name: req.body.name,
          label: req.body.label
        },
      });

      //redirect back
      return res.redirect("/admin/users/permissions");
    } catch (error) {
      next(error);
    }
  }

}

module.exports = new permissionController();
