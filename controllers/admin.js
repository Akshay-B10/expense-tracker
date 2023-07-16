const path = require("path");

const User = require("../models/user");
const { where } = require("sequelize");
const { error } = require("console");

exports.getIndex = (req, res) => {
    res.sendFile(path.join(__dirname, "../", "views", "signup.html"))
};

exports.addUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (!user) {
            const data = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            return res.json(data);
        }
        throw ("Email already exist");
    } catch(err) {
        res.json(err);
    }
};