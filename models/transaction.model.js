var mongoose = require("mongoose");

// Get the Schema constructor
var Schema = mongoose.Schema;

// Using Schema constructor, create a ProductSchema
var transactionSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    isComplete: {
        type: Boolean,
        required: true
    },
    idUser: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    idBook: {
        type: Schema.Types.ObjectId,
        ref: "Book"
    }
});

// Create model from the schema
var Transaction = mongoose.model("Transaction", transactionSchema, 'transactions');

// Export model
module.exports = Transaction;

