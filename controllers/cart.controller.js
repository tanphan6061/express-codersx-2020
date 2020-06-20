const db = require('../db');
module.exports.addToCart = function (req, res, next) {
    let bookId = req.params.bookId;
    let sessionId = req.signedCookies.sessionId;

    let book = db.get('books').find({ id: bookId }).value();
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