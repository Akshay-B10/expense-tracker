const Expenses = require("../models/expenses");
const User = require("../models/user");
const sequelize = require("../utils/config");

exports.showLeaderBoard = async (req, res) => {
    const usersAmount = await Expenses.findAll({
        attributes:[
            "userId",
            [sequelize.fn("sum", sequelize.col("amount")), "totalAmount"]
        ],
        include: {
            model: User,
            attributes: ["name"],
        },
        group: "userId",
        order: [
            ["totalAmount", "DESC"]
        ]
    });
    const resData = [];
    for (let i = 0; i < usersAmount.length; i++) {
        const details = {};
        details.totalAmount = usersAmount[i].dataValues.totalAmount;
        details.name = usersAmount[i].user.name;
        resData.push(details);
    }
    res.json(resData);
};