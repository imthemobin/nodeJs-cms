const controller = require('app/http/controllers/controller');

class indexController extends controller {
    index(req , res) {
        res.render('admin/courses/index',  { title : 'دوره ها'});
    }

    create(req , res) {
        res.render('admin/courses/create');        
    }
}

module.exports = new indexController();