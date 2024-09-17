const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const otpGenerator = require("otp-generator");
const sendMail = require("../lib/sendMail");
const htmlOtp = require("../templates/sendOtp");
const filterObj = require("../lib/filterObj");
const generateAccessToken = require("../middlewares/jwt");

const sendOtpEmail = asyncHandler(async (email) => {
  const new_otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const otp_expiry_time = Date.now() + 10 * 60 * 1000; // 10 Mins after otp is sent

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found.");

  user.otp = new_otp;
  user.otp_expiry_time = otp_expiry_time;

  await user.save({ new: true, validateModifiedOnly: true });

  await sendMail({
    email: user.email,
    html: htmlOtp({ user: user.displayName, otp: new_otp }),
    subject: "Threads: Verify your email.",
  });
});

const register = asyncHandler(async (req, res) => {
  const { userName, displayName, email, password } = req.body;
  if (!(userName && displayName && email && password))
    throw new Error("Invalid request.");

  const filteredBody = filterObj(
    req.body,
    "userName",
    "displayName",
    "email",
    "password"
  );

  const userName_exit = await User.findOne({ userName });
  if (userName_exit) throw new Error("User name already exists.");
  const email_exit = await User.findOne({ email });
  if (email_exit && email_exit.verified)
    throw new Error("Email already in use, Please login.");
  else if (email_exit) {
    const new_user = await User.findOneAndUpdate({ email }, filteredBody, {
      new: true,
      validateModifiedOnly: true,
    });

    if (new_user) await sendOtpEmail(new_user.email);

    return res.status(new_user ? 200 : 500).json({
      success: new_user ? true : false,
      mes: new_user
        ? "User registered successfully. Please check your email to verify your account."
        : "Failed to register user.",
    });
  } else {
    const new_user = await User.create(filteredBody);
    if (new_user) await sendOtpEmail(new_user.email);

    return res.status(new_user ? 200 : 500).json({
      success: new_user ? true : false,
      mes: new_user
        ? "User registered successfully. Please check your email to verify your account."
        : "Failed to register user.",
    });
  }
});

const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new Error("Invalid request.");

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found.");

  await sendOtpEmail(user.email);

  return res.status(200).json({
    success: true,
    mes: "OTP sent to your email.",
  });
});

const verifyOTP = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) throw new Error("Invalid request.");

  const user = await User.findOne({
    email,
    otp_expiry_time: { $gt: Date.now() },
  });

  if (!user) throw new Error("Email is invalid or OTP expired.");
  if (user.verified) throw new Error("Email is already verified.");
  if (!(await user.isCorrectOTP(otp))) throw new Error("OTP is incorrect.");

  user.verified = true;
  user.otp = null;
  user.otp_expiry_time = undefined;
  await user.save();

  generateAccessToken(user._id, user.role, res);

  next();

  return res.status(200).json({
    success: true,
    mes: "Email verified successfully.",
  });
});

const login = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;
  if (!(userName || password)) throw new Error("Invalid request.");

  const user = await User.findOne({ userName }).select("+password");

  if (!user) throw new Error("User not found.");
  if (!user.verified)
    throw new Error(
      "Email is not verified. Please verify email before logging in."
    );
  if (!user.password) throw new Error("Incorrect password.");
  if (!(await user.isCorrectPassword(password)))
    throw new Error("Email or password is incorrect.");

  generateAccessToken(user._id, user.role, res);

  return res.status(200).json({
    success: true,
    mes: "Logged in successfully.",
  });
});

const logout = asyncHandler(async (req, res) => {
  const { accessToken } = req.cookies;

  if (!accessToken) throw new Error("No refresh is cookies.");

  res.clearCookie("accessToken", { httpOnly: true, secure: true });
  return res.status(200).json({
    success: true,
    mes: "Logged out successfully.",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new Error("Invalid request.");

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found.");

  await sendOtpEmail(user.email);

  return res.status(200).json({
    success: true,
    mes: "OTP sent to your email. Please check your email to reset your password.",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!(email || otp || newPassword)) throw new Error("Invalid request.");

  const user = await User.findOne({
    email,
    otp_expiry_time: { $gt: Date.now() },
  });

  if (!user) throw new Error("Email is invalid or OTP expired.");
  if (!(await user.isCorrectOTP(otp))) throw new Error("OTP is incorrect.");

  user.password = newPassword;
  user.verified = true;
  user.otp = null;
  user.otp_expiry_time = undefined;
  await user.save();

  return res.status(200).json({
    success: true,
    mes: "Password reset successfully. Please login with your new password.",
  });
});

module.exports = {
  register,
  sendOtp,
  login,
  logout,
  verifyOTP,
  forgotPassword,
  resetPassword,
};
