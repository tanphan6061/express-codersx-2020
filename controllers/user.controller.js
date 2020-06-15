const shortid = require("shortid");
const db = require("../db");
const pagination = require("../helper/pagination");


module.exports.index = function(req, res) {
  let page = req.query.page || 1;
  let total = db.get("users").value().length;
  pagination.init(page, total);
  let drop = pagination.drop;

  let users = db
    .get("users")
    .drop(drop)
    .take(pagination.perPage)
    .value();
  res.render("users/index", { users, pagination: pagination.html() });
};

module.exports.store = function(req, res) {
  let { username, phone } = req.body;
  let isAdmin = false;
  let wrongLoginCount = 0;
  
  return;
  if (username != "" && username.length <= 30) {
    db.get("users")
      .push({
        id: shortid.generate(),
        username,
        phone,
        isAdmin,
        wrongLoginCount
      })
      .write();
  }
  res.redirect("back");
};

module.exports.destroy = function(req, res) {
  let id = req.params.id;
  db.get("users")
    .remove({ id })
    .write();
  res.redirect("back");
};

module.exports.update = function(req, res) {
  let id = req.params.id;
  let { username, phone } = req.body;
  if (username != "") {
    db.get("users")
      .find({ id })
      .assign({ username, phone })
      .write();
  }
  res.redirect("back");
};
