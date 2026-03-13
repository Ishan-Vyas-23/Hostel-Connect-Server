const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const dashboardController = require("../controllers/dashboardController");

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["resident", "staff", "warden", "admin"]),
  dashboardController.getDashboardStats,
);
module.exports = router;
