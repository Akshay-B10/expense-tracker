const path = require("path");

const User = require("../models/user");

exports.userLogIn = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (email === "" || password === "") {
            throw ("Please enter required credentials");
        }
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        if (!user) {
            throw ("Email not exist");
        }
        if (user.password !== password) {
            throw ("Password doesn't match");
        }
        res.json(user);

    } catch(err) {
        res.json(err);
    }
};