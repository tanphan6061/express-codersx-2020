const db = require("../db");
module.exports.index = function (req, res) {
    res.render('profile/index')
};

module.exports.edit = function (req, res) {
    res.render('profile/edit');
}

module.exports.update = function (req, res) {
    if (req.file) {
        db.get("users")
        .find({ id: res.locals.user.id })
        .assign({avatarUrl : req.file.path})
        .write();
    }
    res.redirect('/profile');
}