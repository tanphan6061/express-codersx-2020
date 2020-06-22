const shortid = require("shortid");
const db = require("../db");
const pagination = require("../helper/pagination");
const Book = require('../models/book.model');

module.exports = {
  async index(req, res) {

    let page = req.query.page || 1;
    let total = db.get("books").value().length;
    pagination.init(page, total);
    let drop = pagination.drop;

    let books = db
      .get("books")
      .drop(drop)
      .take(pagination.perPage)
      .value();

    res.render("books/index", {
      books,
      pagination: pagination.html(),
      csrf: req.csrfToken()
    });
    // let books = await Book.find();
    // res.render("books/index", {
    //   books,
    //   pagination: ''
    // });
  },

  store(req, res) {
    let { title, description } = req.body;
    let coverUrl = req.file ? req.file.path : '';

    if (title) {
      db.get("books")
        .push({ id: shortid.generate(), title, description, coverUrl })
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
    let data = {
      title, description
    }
    if (req.file) {
      data.coverUrl = req.file.path;
    }

    if (title != "") {
      db.get("books")
        .find({ id })
        .assign(data)
        .write();
    }
    res.redirect("back");
  }
};
