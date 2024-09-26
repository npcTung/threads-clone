const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { dataUsers } = require("../data");

const fn1 = async (user) => {
  await User.create(user);
};

const insertUser = asyncHandler(async (req, res) => {
  const promises = [];
  for (let user of dataUsers) promises.push(fn1(user));
  await Promise.all(promises);
  return res.status(201).json({
    success: true,
    message: "Insert user successfully.",
  });
});

module.exports = { insertUser };
