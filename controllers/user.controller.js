const User = require('../models/user.model');
const pagination = require("../helper/pagination");

module.exports.index = async function (req, res) {
  let page = req.query.page || 1;
  let total = await User.countDocuments() - 1;
  pagination.init(page, total);
  // console.log(await User.find({_id:{'$ne': res.locals.user.id}}).count(true))
  let users = await User.find({_id:{$ne: res.locals.user.id}}).limit(pagination.perPage).skip(pagination.drop);
  res.render("users/index", { users, pagination: pagination.html(), csrf: req.csrfToken() });
};

module.exports.store = async function (req, res) {
  let { username, phone } = req.body;
  let isAdmin = false;
  let wrongLoginCount = 0;

  let avatarUrl = req.file ? req.file.path : '';
  if (username != "" && username.length <= 30) {
    await User.create({
      username,
      phone,
      isAdmin,
      wrongLoginCount,
      avatarUrl
    })
  }
  res.redirect("back");
};

module.exports.destroy = async function (req, res) {
  let _id = req.params.id;
  await User.deleteOne({ _id })
  res.redirect("back");
};

module.exports.update = async function (req, res) {
  let id = req.params.id;
  let { username, phone } = req.body;
  let data = {
    username, phone
  }
  if (req.file) {
    let avatarUrl = req.file.path;
    data.avatarUrl = avatarUrl;
  }
  if (username != "") {
    await User.findByIdAndUpdate(id, data);
  }
  res.redirect("back");
};
