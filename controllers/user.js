const path = require("path");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Expense = require("../models/expense");
const Download = require("../models/download");

const S3Services = require("../services/S3-services");

const secretKey = process.env.SECRET_TOKEN;

function generateToken(id) {
    return jwt.sign({
        userId: id
    }, secretKey);
}

exports.userLogIn = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (email == "" || password == "") {
            throw ("Please enter required credentials");
        }
        const user = await User.findOne({
            email: email
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
            token: generateToken(user._id)
        });
    } catch (err) {
        res.status(500).json({
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
        const expense = new Expense({
            amount: amount,
            description: desc,
            category: category,
            userId: req.user
        });
        await expense.save();
        req.user.totalAmount += +amount;
        await req.user.save();
        res.json(expense);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

exports.getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({
            userId: req.user._id
        });
        res.json({
            expenses,
            isPremium: req.user.isPremium
        });
    } catch (err) {
        res.status(500).json({
            message: "Could not fetch expenses"
        });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const id = req.query.id;
        const expense = await Expense.findById(id);
        if (expense.userId.toString() !== req.user._id.toString()) {
            throw ("Expense cannot be deleted");
        }
        await Expense.findByIdAndDelete(id);
        req.user.totalAmount -= expense.amount;
        await req.user.save();
        res.json({
            success: true,
            message: "Deleted"
        });
    } catch (err) {
        res.status(500).json({
            message: err
        });
    }
};

exports.downloadPrevReport = async (req, res) => {
    try {
        const id = req.query.id;
        const download = await Download.findById(id);
        res.json({
            success: true,
            fileUrl: download.fileUrl
        });
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
            success: false
        });
    }
};

exports.downloadReport = async (req, res) => {
    try {
        const id = req.user._id;
        const expenses = await Expense.find({
            userId: id
        });
        const stringifiedExpenses = JSON.stringify(expenses);
        const fileName = `expenses${id}_${new Date}.txt`;
        const fileUrl = await S3Services.uploadToS3(fileName, stringifiedExpenses);
        const download = new Download({
            fileUrl: fileUrl,
            fileName: fileName,
            userId: req.user
        });
        const downloadObj = await download.save();
        const reqData = {
            _id: downloadObj._id,
            fileUrl: downloadObj.fileUrl,
            fileName: downloadObj.fileName,
            createdAt: downloadObj.createdAt,
        };
        res.status(201).json({
            success: true,
            fileUrl: fileUrl,
            fileName: fileName,
            download: reqData
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            err,
            message: "Something went wrong",
            success: false
        });
    }
};

exports.showLimitedDownloads = async (req, res) => {
    try {
        const limit = +req.query.rowsPerPage;
        const page = +req.query.page;
        const downloads = await Download
            .find({
                userId: req.user._id
            })
            .sort({
                createdAt: -1
            });
        const lastPage = Math.ceil(downloads.length / limit);
        const prevPage = page - 1;
        const nextPage = page + 1;
        res.json({
            downloads: downloads.slice((page - 1) * limit, (page - 1) * limit + limit),
            lastPage: lastPage,
            prevPage: prevPage,
            currentPage: page,
            nextPage: nextPage,
            total: downloads.length
        });
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong"
        });
    }
};