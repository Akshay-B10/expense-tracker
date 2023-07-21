const path = require("path");

exports.getFormToSubmitEmail = (req, res) => {
    res.sendFile(path.join(__dirname, "../", "views", "forgot-password.html"));
};

exports.forgotPassword = (req, res) => {
    res.json({
        success: true,
        message: "forgot password"
    });
};