const express = require("express");

const router = express.Router();

const passwordController = require("../controllers/password");
const userAuth = require("../middleware/auth");

// router.get("/", passwordController.getFormToSubmitEmail);

// router.post("/forgot-password", userAuth.authenticate, passwordController.sendMailToUser);

// router.post("/reset-password/update", userAuth.authenticate, passwordController.setNewPassword);

// router.get("/reset-password/:uuid", passwordController.uuidValidation);

module.exports = router;