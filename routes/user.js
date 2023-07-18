const express = require("express");

const router = express.Router();

const userController = require("../controllers/user");

router.post("/login", userController.userLogIn);

router.get("/home", userController.userHome);

router.post("/add-expense", userController.addExpense);

router.get("/get-all-expenses", userController.getAllExpenses);

router.get("/delete-expense", userController.deleteExpense);

module.exports = router;