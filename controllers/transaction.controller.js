const shortid = require("shortid");
const db = require("../db");
const pagination = require("../helper/pagination");

module.exports.index = function (req, res) {
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
    .cloneDeep()
    .value();

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

module.exports.create = function (req, res) {
  let users = db
    .get("users")
    .filter({ id: res.locals.user.id })
    .value();
  // let users = res.locals.user;
  let books = db.get("books").value();
  res.render("transactions/create", { users, books, csrf: req.csrfToken() });
};

module.exports.store = function (req, res) {
  let { idUser, idBook, amount } = req.body;
  if (amount < 1)
    amount = 1;
  db.get("transactions")
    .push({ id: shortid.generate(), idUser, idBook, amount, isComplete: false })
    .write();
  res.redirect("/transactions");
};

module.exports.update = function (req, res) {
  let id = req.params.id;
  db.get("transactions")
    .find({ id })
    .assign({ isComplete: true })
    .write();
  res.redirect("back");
};

module.exports.rentBook = function (req, res) {
  let sessionId = res.locals.cart.id;

  let cart = db
    .get('sessions')
    .find({
      id: sessionId
    })
    .cloneDeep()
    .value().cart;

  for (idBook in cart) {
    db.get("transactions")
      .push({ id: shortid.generate(), idUser: res.locals.user.id, idBook, amount: cart[idBook], isComplete: false })
      .write();
  }

  db.get('sessions')
    .find({ id: sessionId })
    .assign({ cart: {} })
    .write();
  res.redirect('/transactions')
}