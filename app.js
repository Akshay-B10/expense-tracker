const path = require("path");
const fs = require("fs");

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");

// const sequelize = require("./utils/config");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const premiumRoutes = require("./routes/premium");
// const passwordRoutes = require("./routes/password");
const errorController = require("./controllers/error");

const app = express();

// const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
//     flags: "a" 
// });

app.use(bodyParser.json({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
// app.use(helmet.contentSecurityPolicy({
//     directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'", "https://checkout.razorpay.com/", "https://cdnjs.cloudflare.com/", "https://api.razorpay.com"], // due to error: failed to load script
//         frameSrc: ["'self'", "https://api.razorpay.com"] // due to error: refused to frame
//     }
// }));
// app.use(morgan("combined", {
//     stream: accessLogStream
// }));

app.use(adminRoutes);

app.use("/user/premium", premiumRoutes);

app.use("/user", userRoutes);

// app.use("/password", passwordRoutes);

app.use(errorController.getError404);

mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        app.listen(Number(process.env.PORT_NUMBER))
    })
    .catch(err => console.log(err));