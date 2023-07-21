const express = require("express");

const router = express.Router();

const passwordController = require("../controllers/password");

router.get("/", passwordController.getFormToSubmitEmail);

router.post("/forgot-password", passwordController.sendMailToUser);

module.exports = router;