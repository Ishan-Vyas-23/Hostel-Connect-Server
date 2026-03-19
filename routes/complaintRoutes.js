const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const complaintController = require("../controllers/complaintController");

router.get(
  "/manage",
  authMiddleware,
  roleMiddleware(["admin", "warden", "staff"]),
  complaintController.getAllComplaints,
);

router.get("/my", authMiddleware, complaintController.getMyComplaints);

router.get("/", complaintController.getAllComplaints);

router.post("/", authMiddleware, complaintController.createComplaint);

router.put("/:id", authMiddleware, complaintController.updateComplaint);

router.delete("/:id", authMiddleware, complaintController.deleteComplaint);

router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["admin", "warden", "staff"]),
  complaintController.updateComplaintStatus,
);

router.get("/:id", authMiddleware, complaintController.getComplaintById);

module.exports = router;
