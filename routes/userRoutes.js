const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

const roleMiddleware = require("../middleware/roleMiddleware");

// ADMIN ONLY
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  userController.getAllUsers,
);
router.post(
  "/create",
  authMiddleware,
  roleMiddleware(["admin"]),
  userController.createUserByAdmin,
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  userController.updateUser,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  userController.deleteUser,
);
router.get("/me", authMiddleware, userController.getMe);

module.exports = router;
