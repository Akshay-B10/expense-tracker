const path = require("path");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Expenses = require("../models/expenses");

const secretKey = "shhhh";

function generateToken(id) {
    return jwt.sign({
        userId: id
    }, secretKey);
}

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
        };

        // Invalid password
        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            return res.status(401).json({
                success: false,
                message: "Password incorrect"
            });
        };

        // Login successfull
        return res.json({
            success: true,
            message: "Successfully logged in",
            token: generateToken(user.id)
        });
    } catch (err) {
        res.json({
            success: false,
            message: err
        });
    }
};

exports.userHome = (req, res) => {
    res.sendFile(path.join(__dirname, "../", "views", "home.html"));
};

exports.addExpense = async (req, res) => {
    try {
        const { amount, desc, category } = req.body;
        const expense = await Expenses.create({
            amount: amount,
            description: desc,
            category: category,
            userId: req.user.id
        });
        res.json({
            amount: expense.amount,
            description: expense.description,
            category: expense.category
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

exports.getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expenses.findAll({
            where: {
                userId: req.user.id
            }
        });
        res.json(expenses);
    } catch(err) {
        console.log(err);
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const id = req.query.id;
        const expense = await Expenses.findByPk(id);
        if (expense.userId !== req.user.id) {
            throw("Expense cannot be deleted");
        }
        await expense.destroy();
        res.redirect("/user/home");
    } catch (err) {
        res.status(500).json({
            message: err
        });
    }
};