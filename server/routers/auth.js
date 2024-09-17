const router = require("express").Router();
const authController = require("../controllers/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.put("/verify-otp", authController.verifyOTP);
router.put("/send-otp", authController.sendOtp);
router.put("/forgot-password", authController.forgotPassword);
router.put("/reset-password", authController.resetPassword);
router.get("/logout", authController.logout);

module.exports = router;
