const express = require("express");
const router = express.Router();
const {
  forgotPassword,
  registerUser,
  loginUser,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);

module.exports = router;
