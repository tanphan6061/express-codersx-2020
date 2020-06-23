const User = require('../../models/user.model');
const Book = require('../../models/book.model');
const Transaction = require('../../models/transaction.model');
const mongoose = require('mongoose');

module.exports.index = async function (req, res) {
    let transactions = await Transaction.find();
    res.status(200).json({ transactions });
};
