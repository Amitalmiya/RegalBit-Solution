const express = require("express");
const router = express.Router();

const { userRegistration, allUsers, getUserById, updateUser, deleteUser, toggleUserStatus } = require("../controllers/userController");

router.post("/", userRegistration);

router.get("/", allUsers);

router.get("/:id", getUserById);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser)

router.patch("/:id/status", toggleUserStatus);

module.exports = router;