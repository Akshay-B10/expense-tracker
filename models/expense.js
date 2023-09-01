const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const expense = new Schema({
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" }
});

module.exports = mongoose.model("Expense", expense);