const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin");

router.get("/", adminController.getIndex);

router.post("/add-user", adminController.addUser);

module.exports = router;