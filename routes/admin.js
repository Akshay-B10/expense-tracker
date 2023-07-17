const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin");

router.get("/", adminController.getSignUp); // Temporary Page at base url.

router.get("/signup", adminController.getSignUp);

router.get("/login", adminController.getLogIn);

router.post("/add-user", adminController.addUser);

module.exports = router;