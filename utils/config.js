const {Sequelize} = require("sequelize");

const sequelize = new Sequelize("expense-tracker", "root", "MonkeyD.Luffy", {
    dialect: "mysql",
    host: "localhost"
});

module.exports = sequelize;