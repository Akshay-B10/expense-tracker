const {Sequelize} = require("sequelize");

const sequelize = require("../utils/config");

const Downloads = sequelize.define("downloads", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    fileUrl: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = Downloads;