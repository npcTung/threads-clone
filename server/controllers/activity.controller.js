const Activity = require("../models/activity.model");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");

const getActivities = asyncHandler(async (req, res) => {
  const cursor = req.query.cursor || undefined;
  const pageSize = 10;
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user)
    return res
      .status(404)
      .json({ success: false, mes: "Không tìm thấy người dùng." });

  const formatedQueries = { recipientId: user._id };

  if (cursor) formatedQueries._id = { $lt: cursor };

  const activities = await Activity.find(formatedQueries)
    .populate([
      {
        path: "isSuerId",
        select: "-verified -password -role -otp -otp_expiry_time",
      },
      { path: "postId" },
      { path: "postId.$.comments" },
    ])
    .sort({ createAt: -1 })
    .limit(pageSize + 1);

  const nextCursor =
    activities.length > pageSize ? activities[pageSize]._id : null;

  return res.status(activities.length ? 200 : 404).json({
    success: !!activities.length,
    mes: !activities.length ? "Không có thông báo nào." : undefined,
    data: activities.length ? activities.slice(0, pageSize) : undefined,
    nextCursor,
  });
});

const unreadCount = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user)
    return res
      .status(404)
      .json({ success: false, mes: "Không tìm thấy người dùng." });

  const unreadCount = await Activity.countDocuments({
    recipientId: user._id,
    read: false,
  });

  return res.status(200).json({
    success: true,
    unreadCount,
  });
});

const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user)
    return res
      .status(404)
      .json({ success: false, mes: "Không tìm thấy người dùng." });

  await Activity.updateMany(
    { recipientId: user._id, read: false },
    { read: true }
  );

  return res.status(200).json({
    success: true,
    mes: "Đã đọc tất cả thông báo.",
  });
});

module.exports = { getActivities, unreadCount, markAsRead };
