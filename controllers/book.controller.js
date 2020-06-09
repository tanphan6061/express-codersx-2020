const shortid = require("shortid");
const db = require("../db");

module.exports = {
  index(req, res) {
    let books = db.get("books").value();
    res.render("books/index", { books });
  },

  store(req, res) {
    let { title, description } = req.body;
    if (title != "") {
      db.get("books")
        .push({ id: shortid.generate(), title, description })
        .write();
    }
    res.redirect("back");
  },

  destroy(req, res) {
    let id = req.params.id;
    db.get("books")
      .remove({ id })
      .write();
    res.redirect("back");
  },
  
  update(req, res) {
    let id = req.params.id;
    let { title, description } = req.body;
    if (title != "") {
      db.get("books")
        .find({ id })
        .assign({ title, description })
        .write();
    }
    res.redirect("back");
  }
};
