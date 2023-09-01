const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const order = new Schema({
    orderId: { type: String },
    paymentId: { type: String },
    status: { type: String },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" }
});

module.exports = mongoose.model("Order", order);