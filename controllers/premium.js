const Expenses = require("../models/expenses");
const User = require("../models/user");
const sequelize = require("../utils/config");

exports.showLeaderBoard = async (req, res) => {
    const resData = await User.findAll({
        attributes: [
            "id",
            "name",
            "totalAmount"
        ],
        order: [
            ["totalAmount", "DESC"]
        ]
    });
    res.json(resData);
};