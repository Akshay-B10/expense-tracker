const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./utils/config");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(bodyParser.json({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use(adminRoutes);

sequelize
    .sync()
    .then(() => {
        app.listen(4000)
    })
    .catch(err => console.log(err));
