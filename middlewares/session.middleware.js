const shortId = require('shortid');
const db = require('../db');

module.exports = function (req, res, next) {
    let sessionId = req.signedCookies.sessionId;
    if (!sessionId) {

        sessionId = shortId.generate();
        res.cookie('sessionId', sessionId, {
            signed: true
        });
        db.get('sessions').push({
            id: sessionId
        }).write();
    }

    let cart = db.get('sessions')
        .find({ id: sessionId })
        .get('cart')
        .value();

    let total = 0;
    for (let idBook in cart) {
        total += cart[idBook];
    }

    res.locals.cart = { id: sessionId, total };

    next();
}