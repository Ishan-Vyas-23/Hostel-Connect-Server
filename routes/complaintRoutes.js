const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const complaintController = require("../controllers/complaintController");

router.get("/", complaintController.getAllComplaints);

router.get("/my", authMiddleware, complaintController.getMyComplaints);

router.get("/:id", complaintController.getComplaintById);

router.post("/", authMiddleware, complaintController.createComplaint);

router.put("/:id", authMiddleware, complaintController.updateComplaint);

router.delete("/:id", authMiddleware, complaintController.deleteComplaint);

router.patch(
  "/:id/status",
  authMiddleware,
  complaintController.updateComplaintStatus,
);

module.exports = router;
