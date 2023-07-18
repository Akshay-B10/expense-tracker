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
        const { name, email, password } = req.body;
        if (name === "" || email === "" || password === "") {
            throw ("Please fill required credentials");
        }
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        if (!user) {
            const saltRounds = 10;
            const hash = await bcrypt.hash(req.body.password, saltRounds)
            const user = await User.create({
                name: name,
                email: email,
                password: hash
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