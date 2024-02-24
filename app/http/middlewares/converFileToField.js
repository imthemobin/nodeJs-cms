const middleware = require("./middlewares");

// becuse multer is multipart whant to change this to validator is work currect
class converFileTofield extends middleware {
  handler(req, res, next) {
    // Check if req.file is defined
    if (req.file && req.file.filename) {
      req.body.images = req.file.filename;
    } else {
      req.body.images = undefined;
    }

    next();
  }
}

module.exports = new converFileTofield();
