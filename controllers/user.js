const bcrypt = require("bcrypt");

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
        // Invalid email
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        //Invalid password
        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            return res.status(401).json({
                success: false,
                message: "Password incorrect"
            });
        }
        return res.json({
            success: true,
            message: "Successfully logged in"
        });
    } catch (err) {
        res.json({
            success: false,
            message: err
        });
    }
};