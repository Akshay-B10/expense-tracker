const jwt = require("jsonwebtoken");

const User = require("../models/user");

const secretKey = "shhhh";

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        const unknownUser = jwt.verify(token, secretKey); // returns object which encrypted using secret key
        const user = await User.findByPk(unknownUser.userId);
        if (!user) {
            throw("Something went wrong");
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({
            message: err
        });
    }
};