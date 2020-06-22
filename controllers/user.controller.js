const shortid = require("shortid");
const db = require("../db");
const pagination = require("../helper/pagination");


module.exports.index = function (req, res) {
  let page = req.query.page || 1;
  let total = db.get("users").value().length;
  pagination.init(page, total);

  let users = db
    .get("users")
    .drop(pagination.drop)
    .take(pagination.perPage)
    .value();
  res.render("users/index", { users, pagination: pagination.html(), csrf: req.csrfToken() });
  // res.render("users/index", { users, pagination: pagination.html() });
};

module.exports.store = function (req, res) {
  let { username, phone } = req.body;
  let isAdmin = false;
  let wrongLoginCount = 0;

  let avatarUrl = req.file ? req.file.path : '';
  if (username != "" && username.length <= 30) {
    db.get("users")
      .push({
        id: shortid.generate(),
        username,
        phone,
        isAdmin,
        wrongLoginCount,
        avatarUrl
      })
      .write();
  }
  res.redirect("back");
};

module.exports.destroy = function (req, res) {
  let id = req.params.id;
  db.get("users")
    .remove({ id })
    .write();
  res.redirect("back");
};

module.exports.update = function (req, res) {
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
    db.get("users")
      .find({ id })
      .assign(data)
      .write();
  }
  res.redirect("back");
};
