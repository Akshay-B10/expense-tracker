const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin");
const userAuth = require("../middleware/auth");

router.get("/", adminController.getSignUp); // Temporary Page at base url.

router.get("/signup", adminController.getSignUp);

// router.get("/login", adminController.getLogIn);

router.post("/add-user", adminController.addUser);

// router.get("/buy/premium-membership", userAuth.authenticate, adminController.buyPremium);

// router.post("/buy/update-transaction-status", userAuth.authenticate, adminController.updateTransactionDetails);

module.exports = router;