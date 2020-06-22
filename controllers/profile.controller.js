const User = require('../models/user.model')
module.exports.index = function (req, res) {
    res.render('profile/index')
};

module.exports.edit = function (req, res) {
    res.render('profile/edit', {
        csrf: req.csrfToken()
    });
}

module.exports.update = async function (req, res) {
    if (req.file) {
        await User.findOneAndUpdate({ _id: res.locals.user.id }, { avatarUrl: req.file.path });
    }
    res.redirect('/profile');
}