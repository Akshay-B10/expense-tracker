const path = require("path");

const bcrypt = require("bcrypt");
const Razorpay = require("razorpay");

const User = require("../models/user");
const Order = require("../models/order");

exports.getSignUp = (req, res) => {
    res.sendFile(path.join(__dirname, "../", "views", "signup.html"))
};

exports.getLogIn = (req, res) => {
    res.sendFile(path.join(__dirname, "../", "views", "login.html"));
}

exports.addUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (name == "" || email == "" || password == "") {
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
        res.status(500).json(err);
    }
};

exports.buyPremium = async (req, res) => {
    try {
        let rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500; // In paise. (Desired rupees * 100)
        const order = await rzp.orders.create({
            amount,
            currency: "INR"
        });
        if (!order) {
            throw ("Something went wrong");
        }
        await Order.create({
            orderId: order.id,
            status: "PENDING",
            userId: req.user.id
        }); // Till now payment is not yet done. So paymentId won't be generated.
        return res.status(201).json({
            order,
            key_id: rzp.key_id
        });
    } catch(err) {
        res.status(500).json(err);
    }
};

exports.updateTransactionDetails = async (req, res) => {
    try {
        const { orderId, paymentId } = req.body;
        const order = await Order.findOne({
            where: {
                orderId: orderId
            }
        });
        order.update({
            status: "SUCCESSFUL",
            paymentId: paymentId
        });
        req.user.update({
            isPremium: true
        });
        return res.status(202).json({
            success: true,
            message: "Transaction Successful"
        })
    } catch(err) {
        res.status(500).json(err);
    }
};