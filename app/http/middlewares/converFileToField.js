const middleware = require("./middlewares");


// becuse multer is multipart whant to change this to validator is work currect
class converFileTofield extends middleware {
  handler(req, res, next) {
    if (req.file) {
      req.body.images = undefined;
    }
    req.body.images = req.file.filename;
    next();
  }
}

module.exports = new converFileTofield();
