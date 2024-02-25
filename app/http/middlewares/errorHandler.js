class errorHandler {
  async error404(req, res, next) {
    try {
        res.statusCode = 404;
        throw new Error("چنین صفحه ای وجود ندارد");
    } catch (error) {
      next(error);
    }
  }

  async handler(error, req, res, next) {
    const statusCode = error.status || 500;
    const message = error.message || "";
    const stack = error.stack || "";

    const layouts = {
      layout: "errors/master",
      extractScripts: false,
      extractStyles: false,
    };

    if (config.debug)
      return res.render("errors/stack", {
        ...layouts,
        message: message,
        stack: stack,
      });

    return res.render(`errors/${statusCode}`, {
      ...layouts,
      message: message,
      stack: stack,
    });
  }
};

module.exports = new errorHandler()
