const User = require("../models/user");

exports.showLeaderBoard = async (req, res) => {
    try {
        const resData = await User.find({}, "name totalAmount -_id").sort({ totalAmount: -1 });
        res.json(resData);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};