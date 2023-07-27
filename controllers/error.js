const path = require("path");

exports.getError404 = (req, res) => {
    res.sendFile(path.join(__dirname, "../", "views", "error404.html"));
};