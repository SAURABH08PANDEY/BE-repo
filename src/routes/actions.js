const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middlewares/authMiddleware");
const {
  initializeCompany,
  verifyOtp,
  createInterview,
  verifyToken
} = require("../controllers/authAndRegistration");

router.post("/verify-otp/", verifyOtp);
router.post("/init-company/", initializeCompany);
router.post("/create-interview/",authMiddleware, createInterview);
router.get("/verify-token/", authMiddleware, verifyToken);

module.exports = router;
