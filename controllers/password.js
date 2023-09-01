const path = require("path");

const bcrypt = require("bcrypt");

// Package for mailing service
const Sib = require("sib-api-v3-sdk");

const client = Sib.ApiClient.instance;

const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.MAIL_API_KEY;

const sender = {
    email: process.env.MY_EMAIL_ID
};

const { v4: uuidv4 } = require("uuid");

const User = require("../models/user");
const ForgotPasswordRequest = require("../models/forgot-password");

exports.getFormToSubmitEmail = (req, res) => {
    res.sendFile(path.join(__dirname, "../", "views", "forgot-password.html"));
};

exports.sendMailToUser = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({
            email: email
        });
        if (!user) {
            throw ("User not found");
        };
        const transEmailApi = new Sib.TransactionalEmailsApi();

        const reciever = [{
            email: email
        }];

        const uuid = uuidv4(); // Generate random uuid
        // Update data in forgot password req table
        const newRequest = new ForgotPasswordRequest({
            uuid: uuid,
            userId: req.user
        });
        await newRequest.save();
        // ForgotPasswordRequest.create({
        //     uuid: uuid,
        //     userId: req.user.id
        // });
        await transEmailApi.sendTransacEmail({
            sender,
            to: reciever,
            subject: "Forgot Password",
            htmlContent: `
                <p>To reset password click link given below.</p>
                <a href = "http://localhost:4000/password/reset-password/${uuid}">Reset Password</a>
                `
        })
        res.json({
            success: true,
            message: "Check your email for a link to reset password."
        });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.uuidValidation = async (req, res) => {
    try {
        const uuid = req.params.uuid;
        const passReq = await ForgotPasswordRequest.findOne({
            uuid: uuid
        });
        if (!passReq) {
            return res.json({
                message: "Invalid link"
            });
        }
        if (!passReq.isActive) {
            return res.json({
                message: "Link expired"
            });
        }
        passReq.isActive = false;
        await passReq.save();
        // await passReq.update({
        //     isActive: false
        // });
        res.sendFile(path.join(__dirname, "../", "views", "new-password.html"));
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.setNewPassword = async (req, res) => {
    try {
        const newPassword = req.body.password;
        if (newPassword == "") {
            return res.status(500).json({
                message: "fill required details"
            });
        }
        const saltRounds = 10;
        const hash = await bcrypt.hash(newPassword, saltRounds);
        await User.findByIdAndUpdate(req.user._id, {
            password: hash
        });
        // await User.update({
        //     password: hash
        // }, {
        //     where: {
        //         id: req.user.id
        //     }
        // });
        res.json({
            succes: true,
            message: "Password changed successfully!"
        });
    } catch (err) {
        res.status(500).json(err);
    }
};