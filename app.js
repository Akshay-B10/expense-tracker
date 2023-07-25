const path = require("path");

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./utils/config");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const premiumRoutes = require("./routes/premium");
const passwordRoutes = require("./routes/password");

const User = require("./models/user");
const Expenses = require("./models/expenses");
const Order = require("./models/order");
const ForgotPasswordRequest = require("./models/forgot-password");
const Downloads = require("./models/downloads");

const app = express();

app.use(bodyParser.json({extended: false}));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use(adminRoutes);

app.use("/user/premium", premiumRoutes);

app.use("/user", userRoutes);

app.use("/password", passwordRoutes);

// Relations

User.hasMany(Expenses);
Expenses.belongsTo(User, {
    constraints: true,
    onDelete: "CASCADE"
});
User.hasMany(Order);
Order.belongsTo(User, {
    constraints: true,
    onDelete: "CASCADE"
});
User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User, {
    constraints: true,
    onDelete: "CASCADE"
});
User.hasMany(Downloads);
Downloads.belongsTo(User, {
    constraints: true,
    onDelete: "CASCADE"
});

sequelize
    .sync()
    .then(() => {
        app.listen(4000)
    })
    .catch(err => console.log(err));