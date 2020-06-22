const db = require('../db');
const Book = require('../models/book.model');
module.exports.addToCart = async function (req, res, next) {
    let bookId = req.params.bookId;
    let sessionId = req.signedCookies.sessionId;

    let book = await Book.findById(bookId);
    if (!book && sessionId) {
        res.redirect('/books');
    }
    
    let count = db.get('sessions')
        .find({ id: sessionId })
        .get(`cart.${bookId}`, 0)
        .value();

    db.get('sessions')
        .find({ id: sessionId })
        .set(`cart.${bookId}`, count + 1)
        .write();

    res.redirect('/books');
};