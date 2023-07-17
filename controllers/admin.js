const path = require("path");

const bcrypt = require("bcrypt");

const User = require("../models/user");

exports.getSignUp = (req, res) => {
    res.sendFile(path.join(__dirname, "../", "views", "signup.html"))
};

exports.getLogIn = (req, res) => {
    res.sendFile(path.join(__dirname, "../", "views", "login.html"));
}

exports.addUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (!user) {
            const saltRounds = 10;
            bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
                const data = await User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash
                });
            });
            return res.status(201).json({
                message: "Successfully created new user"
            });
        }
        throw ("Email already exist");
    } catch (err) {
        res.json(err);
    }
};