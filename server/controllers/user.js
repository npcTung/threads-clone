const User = require("../models/user");
const filterObj = require("../lib/filterObj");
const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;

const getCurrent = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id)
    .select("-verified -password -role -otp -otp_expiry_time")
    .populate([
      {
        path: "following",
        select: "-verified -password -role -otp -otp_expiry_time",
      },
      {
        path: "follower",
        select: "-verified -password -role -otp -otp_expiry_time",
      },
    ]);
  if (!user) throw new Error("User not found.");

  return res.status(200).json({
    success: true,
    data: user,
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  const { id } = req.user;
  const excludefields = ["limit", "sort", "page", "fields"];
  excludefields.forEach((el) => delete queries[el]);
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (macthedEl) => `$${macthedEl}`
  );

  const user = await User.findById(id);
  if (!user) throw new Error("User not found.");

  let blockIds;
  if (user.blockedUsers) blockIds = user.blockedUsers;
  blockIds.push(id);

  const formatedQueries = JSON.parse(queryString);

  formatedQueries.verified = true;
  formatedQueries._id = { $nin: blockIds };

  if (queries?.name)
    formatedQueries.name = { $regex: queries.name, $options: "i" };
  if (req.query.q) {
    delete formatedQueries.q;
    formatedQueries["$or"] = [
      { userName: { $regex: req.query.q, $options: "i" } },
      { displayName: { $regex: req.query.q, $options: "i" } },
      { email: { $regex: req.query.q, $options: "i" } },
    ];
  }
  let queryCommand = User.find(formatedQueries)
    .select("-verified -password -role -otp -otp_expiry_time")
    .populate([
      {
        path: "following",
        select: "-verified -password -role -otp -otp_expiry_time",
      },
      {
        path: "follower",
        select: "-verified -password -role -otp -otp_expiry_time",
      },
    ])
    .sort({ createdAt: -1 });

  try {
    const response = await queryCommand.exec();
    const counts = await User.find(formatedQueries).countDocuments();
    return res.status(response.length ? 200 : 404).json({
      success: response ? true : false,
      mes: !response.length ? "cannot get users" : undefined,
      counts: counts > 0 ? counts : undefined,
      usersData: response.length ? response : undefined,
    });
  } catch (err) {
    throw new Error(err.message);
  }
});

const getUser = asyncHandler(async (req, res) => {
  const { userName } = req.params;
  const { id } = req.user;

  const user = await User.findOne({ userName })
    .select("-verified -password -role -otp -otp_expiry_time")
    .populate([
      {
        path: "following",
        select: "-verified -password -role -otp -otp_expiry_time",
      },
      {
        path: "follower",
        select: "-verified -password -role -otp -otp_expiry_time",
      },
    ]);
  if (!user) throw new Error("User not found.");

  const currentUser = await User.findById(id);
  if (!currentUser) throw new Error("Current user not found.");
  else if (
    currentUser.blockedUsers &&
    currentUser.blockedUsers.includes(user._id)
  )
    throw new Error("User blocked.");

  return res.status(200).json({
    success: true,
    data: user,
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { displayName, bio, gender, link } = req.body;

  if (!(displayName && bio && gender && link))
    throw new Error("Invalid request.");

  const filteredBody = filterObj(
    req.body,
    "displayName",
    "bio",
    "gender",
    "link"
  );

  const updateUser = await User.findByIdAndUpdate(id, filteredBody, {
    new: true,
    validateModifiedOnly: true,
  });

  return res.status(updateUser ? 200 : 400).json({
    success: true,
    mes: updateUser ? "User successfully updated." : "User not found.",
  });
});

const updateAvatar = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const avatarUrl = req.file.path;
  const filename = req.file.filename;

  if (!(avatarUrl && filename)) throw new Error("Invalid avatar.");

  const user = await User.findById(id);
  if (!user) {
    cloudinary.uploader.destroy(filename);
    throw new Error("User not found.");
  }

  const updateAvatar = await User.findByIdAndUpdate(
    id,
    { avatarUrl, filename },
    { new: true, validateModifiedOnly: true }
  );

  if (!updateAvatar) cloudinary.uploader.destroy(filename);
  else if (updateAvatar && user.avatarUrl && user.filename)
    cloudinary.uploader.destroy(user.filename);

  return res.status(updateAvatar ? 200 : 400).json({
    success: true,
    mes: updateAvatar ? "Avatar successfully updated." : "User not found.",
  });
});

const followUnfollow = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const { id } = req.user;

  const userToModify = await User.findById(uid);
  const currentUser = await User.findById(id);

  if (id === uid) throw new Error("You cannot follow/unfollow yourself.");

  if (!userToModify || !currentUser) throw new Error("User not found.");

  const isFollowing = currentUser.following.includes(uid);

  if (isFollowing) {
    // unfollow
    await User.findByIdAndUpdate(uid, { $pull: { follower: id } });
    await User.findByIdAndUpdate(id, { $pull: { following: uid } });
    return res
      .status(200)
      .json({ success: true, message: "User unfollowed successfully" });
  } else {
    // follow
    await User.findByIdAndUpdate(uid, { $push: { follower: id } });
    await User.findByIdAndUpdate(id, { $push: { following: uid } });
    return res
      .status(200)
      .json({ success: true, message: "User followed successfully" });
  }
});

const blockAccount = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const { id } = req.user;

  const userToModify = await User.findById(uid);
  const currentUser = await User.findById(id);

  if (id === uid) throw new Error("You cannot block/unblock yourself.");

  if (!userToModify || !currentUser) throw new Error("User not found.");

  const isBlocked = currentUser.blockedUsers.includes(uid);

  if (isBlocked) {
    // unblock
    await User.findByIdAndUpdate(id, { $pull: { blockedUsers: uid } });
    return res
      .status(200)
      .json({ success: true, message: "User unblocked successfully" });
  } else {
    // block
    await User.findByIdAndUpdate(id, { $push: { blockedUsers: uid } });
    if (currentUser.following.includes(uid)) {
      await User.findByIdAndUpdate(uid, { $pull: { follower: id } });
      await User.findByIdAndUpdate(id, { $pull: { following: uid } });
    }
    return res
      .status(200)
      .json({ success: true, message: "User blocked successfully" });
  }
});

module.exports = {
  getCurrent,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  followUnfollow,
  blockAccount,
};