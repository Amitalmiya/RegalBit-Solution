const express = require("express");
const router = express.Router();

const { loginUser, userRegistration, allUsers, getUserById, updateUser, deleteUser, toggleUserStatus } = require("../controllers/userController");

router.post("/login", loginUser)

router.post("/registration", userRegistration);

router.get("/", allUsers);

router.get("/:id", getUserById);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser)

router.patch("/:id/status", toggleUserStatus);

module.exports = router;