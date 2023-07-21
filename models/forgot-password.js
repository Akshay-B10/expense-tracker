const {Sequelize} = require("sequelize");

const sequelize = require("../utils/config");

const ForgotPasswordRequest = sequelize.define("forgot-password-request", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    uuid: Sequelize.STRING,
    isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});

module.exports = ForgotPasswordRequest;