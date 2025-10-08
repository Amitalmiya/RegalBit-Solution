const express = require("express");
const router = express.Router();

const authenticateToken = require('../middleware/userMiddleware');

const { loginUser, userRegistration, allUsers, getUserById, updateUser, deleteUser, toggleUserStatus, getUserProfile } = require("../controllers/userController");

router.post("/", userRegistration);

router.post("/login", loginUser)

router.get("/profile/:id", authenticateToken, getUserProfile);

router.get("/allusers", allUsers);

router.put("/update/:id", authenticateToken, updateUser);

router.delete("/delete/:id",authenticateToken, deleteUser)

router.get("/:id",authenticateToken, getUserById);

router.patch("/toggle-status/:id/status", toggleUserStatus);


module.exports = router;