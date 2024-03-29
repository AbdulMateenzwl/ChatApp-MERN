const express = require("express");
const {
    registerUser,
    authUser,
    allUsers
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);
router.route("/").get(protect, allUsers)

module.exports = router;