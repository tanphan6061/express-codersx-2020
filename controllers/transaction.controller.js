const User = require('../models/user.model');
const db = require('../db');
const Book = require('../models/book.model');
const Transaction = require('../models/transaction.model');
const pagination = require("../helper/pagination");

module.exports.index = async function (req, res) {
  let page = req.query.page || 1;
  let total = await Transaction.find({ idUser: res.locals.user.id }).count(true);
  pagination.init(page, total);

  let transactions = await Transaction.
    find({ idUser: res.locals.user.id })
    .limit(pagination.perPage)
    .skip(pagination.drop);

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

module.exports.store = async function (req, res) {
  let { idUser, idBook, amount } = req.body;
  if (amount < 1)
    amount = 1;
  await Transaction.create({ idUser, idBook, amount, isComplete: false })
  res.redirect("/transactions");
};

module.exports.update = async function (req, res) {
  let id = req.params.id;
  await Transaction.findByIdAndUpdate(id, { isComplete: true });
  res.redirect("back");
};

module.exports.rentBook = async function (req, res) {
  let sessionId = res.locals.cart.id;

  let cart = db
    .get('sessions')
    .find({
      id: sessionId
    })
    .cloneDeep()
    .value().cart;

  for (idBook in cart) {
    await Transaction.create({
      idUser: res.locals.user.id,
      idBook,
      amount: cart[idBook],
      isComplete: false
    })
  }

  db.get('sessions')
    .find({ id: sessionId })
    .assign({ cart: {} })
    .write();
  res.redirect('/transactions')
}