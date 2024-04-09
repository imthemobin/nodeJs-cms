const controller = require("app/http/controllers/controller");
const Category = require("app/models/category");
const fs = require("fs");
const path = require("path");

class categoryController extends controller {
  async index(req, res, next) {
    try {
      let page = req.query.page || 1;

      let categories = await Category.paginate(
        {},
        { page: page, sort: { createdAt: 1 }, limit: 20, populate: "parent" }
      );

      res.render("admin/categories/index", {
        title: "دسته بندی ها",
        categories: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res) {
    let categories = await Category.find({ parent: null });
    res.render("admin/categories/create", { categories: categories });
  }

  async store(req, res, next) {
    try {
      let result = await this.validationData(req);

      if (!result) {
        return this.back(req, res);
      }

      // create caregory

      let newCategory = new Category({
        name: req.body.name,
        slug: this.slug(req.body.name),
        parent: req.body.parent !== "none" ? req.body.parent : null,
      });

      await newCategory.save();

      return res.redirect("/admin/categories");
    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      let category = await Category.findById(req.params.id)
        .populate("childs")
        .exec();

      if (!category) {
        this.error("چنین دسته بندی ای وجود ندارد", 404);
      }

      category.childs.forEach(async (category) => await category.deleteOne({}));

      //delete category
      await category.deleteOne({});

      res.redirect("/admin/categories");
    } catch (error) {
      next(error);
    }
  }

  async edit(req, res, next) {
    try {
      this.isMongoId(req.params.id);
      let category = await Category.findById(req.params.id);
      let categories = await Category.find({ parent: null });

      if (!category) {
        this.error("چنین دسته بندی ای وجود ندارد", 404);
      }

      res.render("admin/categories/edit", {
        category: category,
        categories: categories,
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

      //update episode
      let category = await Category.findByIdAndUpdate(req.params.id, {
        $set: {
          name: req.body.name,
          slug: this.slug(req.body.name),
          parent: req.body.parent !== "none" ? req.body.parent : null,
        },
      });

      //redirect back
      return res.redirect("/admin/categories");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new categoryController();
