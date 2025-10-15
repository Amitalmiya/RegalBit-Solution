const express = require("express");
const router = express.Router();

const authenticateToken = require('../middleware/userMiddleware');
const { isAdmin, isSuperAdmin, isAdminOrSuperAdmin } = require('../middleware/roleMiddleware');

const {
  loginUser,
  userRegistration,
  allUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserProfile
} = require("../controllers/userController");


router.post("/", userRegistration);
router.post("/login", loginUser);


router.get("/profile/:id", authenticateToken, getUserProfile);
router.put("/update/:id", authenticateToken, updateUser);
router.get("/:id", authenticateToken, getUserById);


router.get("/", authenticateToken, isAdminOrSuperAdmin, allUsers);
router.patch("/toggle-status/:id/status", authenticateToken, isAdminOrSuperAdmin, toggleUserStatus);


router.delete("/delete/:id", authenticateToken, isSuperAdmin, deleteUser);
router.get("/dashboard", authenticateToken, isSuperAdmin);


router.get("/dashboard", authenticateToken, isAdminOrSuperAdmin);

module.exports = router;
