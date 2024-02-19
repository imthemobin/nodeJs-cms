class adminController{
    index(req , res) {
        res.render('admin/index');
    }
}

module.exports = new adminController()