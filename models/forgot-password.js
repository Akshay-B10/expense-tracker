const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const passwordRequest = new Schema({
    uuid: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" }
});

module.exports = mongoose.model("PasswordRequest", passwordRequest);

// const ForgotPasswordRequest = sequelize.define("forgot-password-request", {
//     id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     uuid: Sequelize.STRING,
//     isActive: {
//         type: Sequelize.BOOLEAN,
//         defaultValue: true
//     }
// });

// module.exports = ForgotPasswordRequest;