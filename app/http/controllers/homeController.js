const controller = require("app/http/controllers/controller");

class homeController extends controller {
  index(req, res) {
    res.json(this.message());
  }

  message() {
    return "Home page";
  }
}

module.exports = new homeController();
