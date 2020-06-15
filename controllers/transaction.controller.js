const shortid = require("shortid");
const db = require("../db");
const pagination = require("../helper/pagination");

module.exports.index = function(req, res) {
  let page = req.query.page || 1;
  let total = db
    .get("transactions")
    .filter({ idUser: res.locals.user.id })
    .value().length;
  pagination.init(page, total);

  let transactions = db
    .get("transactions")
    .filter({ idUser: res.locals.user.id })
    .drop(pagination.drop)
    .take(pagination.perPage)
    .value();
  
  console.log(transactions);
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

  res.render("transactions/index", {
    transactions,
    pagination: pagination.html()
  });
};

module.exports.create = function(req, res) {
  let users = db
    .get("users")
    .filter({ id: res.locals.user.id })
    .value();
  // let users = res.locals.user;
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
  res.redirect("back");
};
