const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upvoteController = require("../controllers/upvoteController");

router.post("/:id", authMiddleware, upvoteController.toggleUpvote);

module.exports = router;
