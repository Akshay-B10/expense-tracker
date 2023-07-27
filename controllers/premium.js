const Expenses = require("../models/expenses");
const User = require("../models/user");
const sequelize = require("../utils/config");

exports.showLeaderBoard = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};