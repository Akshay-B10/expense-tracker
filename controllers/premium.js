const Expenses = require("../models/expenses");
const User = require("../models/user");
const sequelize = require("../utils/config");

exports.showLeaderBoard = async (req, res) => {
    const resData = await User.findAll({
        attributes: [
            "id",
            "name",
            [sequelize.fn("sum", sequelize.col("amount")), "totalAmount"]
        ],
        include: [
            {
                model: Expenses,
                attributes:[]
            }
        ],
        group: "user.id", // since user table has all id's; it is group by user.id
        order: [
            [
            "totalAmount",
            "DESC"
            ]
        ]
    });
    res.json(resData);
};