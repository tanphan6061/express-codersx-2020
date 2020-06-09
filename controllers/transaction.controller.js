const shortid = require("shortid");
const db = require("../db");

module.exports.index = function(req, res) {
  let transactions = db.get("transactions").value();
  let books = db.get("books").value();

  transactions.map(i => {
    i.user = db
      .get("users")
      .find({ id: i.idUser })
      .value();
    i.book = db
      .get("books")
      .find({ id: i.idBook })
      .value();
    return i;
  });

  res.render("transactions/index", { transactions });
};

module.exports.create = function(req, res) {
  let users = db.get("users").value();
  let books = db.get("books").value();
  res.render("transactions/create", { users, books });
};

module.exports.store = function(req, res) {
  let { idUser, idBook } = req.body;
  db.get("transactions")
    .push({ id: shortid.generate(), idUser, idBook, isComplete: false })
    .write();
  res.redirect("/transactions");
};

module.exports.update = function(req, res) {
  let id = req.params.id;
  db.get("transactions")
    .find({ id })
    .assign({ isComplete: true })
    .write();
  res.redirect('back');
};
