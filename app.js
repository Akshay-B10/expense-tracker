const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./utils/config");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
/*
const User = require("./models/user");
const Expenses = require("./models/expenses");
*/
const app = express();

app.use(bodyParser.json({extended: false}));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use(adminRoutes);

app.use("/user", userRoutes);

// Relations
/*
User.hasMany(Expenses);
Expenses.belongsTo(User, {
    constraints: true,
    onDelete: "CASCADE"
});
*/

sequelize
    .sync()
    .then(() => {
        app.listen(4000)
    })
    .catch(err => console.log(err));
