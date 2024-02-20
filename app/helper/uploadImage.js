const multer = require("multer");
const { mkdirp } = require("mkdirp");

const getDirImage = () => {
  let year = new Date().getFullYear();
  let month = new Date().getMonth();
  let day = new Date().getDay();

  return `./public/uploads/images/${year}/${month}/${day}`;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = getDirImage();
    mkdirp(dir).then((error) => {
      cb(null, dir);
    });
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const uploadImage = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

module.exports = uploadImage;
