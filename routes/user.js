const express = require("express");

const router = express.Router();

const userController = require("../controllers/user");
const userAuth = require("../middleware/auth");

router.post("/login", userController.userLogIn);

router.get("/home", userController.userHome);

router.post("/add-expense", userAuth.authenticate, userController.addExpense);

router.get("/get-all-expenses", userAuth.authenticate, userController.getAllExpenses);

router.get("/delete-expense", userAuth.authenticate, userController.deleteExpense);

router.get("/download", userAuth.authenticate, userController.downloadReport);

router.get("/downloads", userAuth.authenticate, userController.showLimitedDownloads);

router.get("/prev/download", userController.downloadPrevReport);

module.exports = router;