const shortid = require("shortid");
const pagination = require("../helper/pagination");
const Book = require('../models/book.model');

module.exports = {
  async index(req, res) {
    let page = req.query.page || 1;
    let total = await Book.countDocuments();
    pagination.init(page, total);
    let books = await Book.find().limit(pagination.perPage).skip(pagination.drop);

    res.render("books/index", {
      books,
      pagination: pagination.html(),
      csrf: req.csrfToken()
    });
  },

  async store(req, res) {
    let { title, description } = req.body;
    let coverUrl = req.file ? req.file.path : '';

    if (title) {
      await Book.create({ id: shortid.generate(), title, description, coverUrl })
    }
    res.redirect("back");
  },

  async destroy(req, res) {
    let _id = req.params.id;
    await Book.deleteOne({ _id });
    res.redirect("back");
  },

  async update(req, res) {
    let _id = req.params.id;
    let { title, description } = req.body;
    let data = {
      title, description
    }
    if (req.file) {
      data.coverUrl = req.file.path;
    }

    if (title != "") {
      await Book.findOneAndUpdate({ _id}, data);
    }
    res.redirect("back");
  }
};
