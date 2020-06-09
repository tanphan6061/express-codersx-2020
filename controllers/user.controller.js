const shortid = require("shortid");
const db = require("../db");

module.exports.index = function(req, res) {
  let users = db.get("users").value();
  res.render("users/index", { users });
};

module.exports.store = function(req, res) {
  let { username, phone } = req.body;
  if (username != "" && username.length <= 30) {
    db.get("users")
      .push({ id: shortid.generate(), username, phone })
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
