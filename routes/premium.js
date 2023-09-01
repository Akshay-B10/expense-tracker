const express = require("express");

const router = express.Router();

const premiumController = require("../controllers/premium");

router.get("/show-leaderboard", premiumController.showLeaderBoard);

module.exports = router;