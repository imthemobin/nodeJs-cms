const controller = require("app/http/controllers/controller");
const Permission = require("app/models/permission");
const Role = require("app/models/role");


class roleController extends controller {
  async index(req, res, next) {
    try {
      let page = req.query.page || 1;

      let roles = await Role.paginate(
        {},
        { page: page, sort: { createdAt: 1 }, limit: 10}
      );

      res.render("admin/roles/index", {
        title: "لیست سطح دسترسی ها ",
        roles: roles,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res) {
    let permissions = await Permission.find({})
    res.render("admin/roles/create",{permissions:permissions});
  }

  async store(req, res, next) {
    try {
      let result = await this.validationData(req);

      if (!result) {
        return this.back(req, res);
      }

      // create role

      let newRole = new Role({
        name: req.body.name,
        label : req.body.label,
        permissions: req.body.permissions,
      });

      await newRole.save();

      return res.redirect("/admin/users/roles");
    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      let role = await Role.findById(req.params.id)

      if (!role) {
        this.error("چنین سطح دسترسی وجود ندارد", 404);
      }


      //delete role
      await role.deleteOne({});

      res.redirect("/admin/users/roles");
    } catch (error) {
      next(error);
    }
  }

  async edit(req, res, next) {
    try {
      this.isMongoId(req.params.id);

      let role = await Role.findById(req.params.id);
      let permissions = await Permission.find({})

      if (!role) {
        this.error("چنین سطح دسترسی وجود ندارد", 404);
      }

      res.render("admin/roles/edit", {
        role: role,
        permissions:permissions,
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
      let role = await Role.findByIdAndUpdate(req.params.id, {
        $set: {
          name: req.body.name,
          label: req.body.label,
          permissions: req.body.permissions,
        },
      });

      //redirect back
      return res.redirect("/admin/users/roles");
    } catch (error) {
      next(error);
    }
  }

}

module.exports = new roleController();
