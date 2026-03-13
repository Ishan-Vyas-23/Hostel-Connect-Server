const express = require("express");
const router = express.Router();

const complaintController = require("../controllers/complaintController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, complaintController.createComplaint);

router.get("/", complaintController.getAllComplaints);

router.get("/:id", complaintController.getComplaintById);

router.put("/:id", authMiddleware, complaintController.updateComplaint);

router.delete("/:id", authMiddleware, complaintController.deleteComplaint);

router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["staff", "warden", "admin"]),
  complaintController.updateComplaintStatus,
);

module.exports = router;
