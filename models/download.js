const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const download = new Schema({
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User"}
});

module.exports = mongoose.model("Download", download);
