const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const noticeController = require("../controllers/noticeController");

// create notice (restricted)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "warden", "staff"]),
  noticeController.createNotice,
);

// get notices (all users)
router.get("/", authMiddleware, noticeController.getAllNotices);

// delete (admin only)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  noticeController.deleteNotice,
);

module.exports = router;
