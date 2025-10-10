const express = require("express");
const router = express.Router();

const authenticateToken = require('../middleware/userMiddleware');

const { loginUser, userRegistration, allUsers, getUserById, updateUser, deleteUser, toggleUserStatus, getUserProfile } = require("../controllers/userController");

const {verifyToken, isAdmin, isSuperAdmin} = require('../middleware/roleMiddleware')

router.post("/", userRegistration);

router.post("/login", loginUser)

router.get("/profile/:id", authenticateToken, getUserProfile);

router.get("/allusers", verifyToken, isAdmin, allUsers);

router.put("/update/:id", authenticateToken, updateUser);

router.delete("/delete/:id",authenticateToken, verifyToken, isSuperAdmin, deleteUser)

router.get("/:id",authenticateToken, getUserById);

router.patch("/toggle-status/:id/status", toggleUserStatus);

module.exports = router;