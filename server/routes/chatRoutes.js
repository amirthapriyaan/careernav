
const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chatController");


router.post("/career", chatController.askCareerQuestion);

module.exports = router;
