const shortid = require("shortid");
const db = require("../db");
const User = require('../models/user.model');
const Book = require('../models/book.model');
const pagination = require("../helper/pagination");

module.exports.index = async function (req, res) {
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

  // transactions.map(async i => {
  //   i.user = await User.findById(i.idUser)
  //   i.book = await Book.findById(i.idBook)
  //   return i;
  // })

  for (let i of transactions) {
    i.user = await User.findById(i.idUser)
    i.book = await Book.findById(i.idBook)
  }

  res.render("transactions/index", {
    transactions,
    pagination: pagination.html()
  });
};

module.exports.create = async function (req, res) {
  let users = await User.find({ _id: res.locals.user.id });
  let books = await Book.find();
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