const path = require("path");

const Sib = require("sib-api-v3-sdk");

const client = Sib.ApiClient.instance;

const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.MAIL_API_KEY;

const sender = {
    email: process.env.MY_EMAIL_ID
};

const User = require("../models/user");

exports.getFormToSubmitEmail = (req, res) => {
    res.sendFile(path.join(__dirname, "../", "views", "forgot-password.html"));
};

exports.sendMailToUser = async (req, res) => {
    try{
        const email = req.body.email;
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        if (!user) {
            throw ("User not found");
        };
        const transEmailApi = new Sib.TransactionalEmailsApi();
    
        const reciever = [
            {
                email: email
            }
        ];
        await transEmailApi.sendTransacEmail({
            sender,
            to: reciever,
            subject: "Dummy Subject",
            textContent: "Hello. Dummy text message"
        })
        res.json({
            success: true,
        });
    } catch (err) {
        res.status(500).json(err);
    }
};