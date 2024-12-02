const Conversation = require("../models/conversation.model");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");

const startConversation = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user) throw new Error("Không tìm thấy người dùng.");

  const conversation = await Conversation.findOne({
    participants: { $all: [uid, id] },
  }).populate([
    {
      path: "participants",
      select: "-verified -password -role -otp -otp_expiry_time",
    },
    { path: "messages" },
  ]);

  if (conversation)
    return res.status(200).json({
      success: true,
      data: conversation,
    });
  else {
    let newConversation = await Conversation.create({
      participants: [uid, id],
    });

    newConversation = await Conversation.findById(newConversation._id).populate(
      [
        {
          path: "participants",
          select: "-verified -password -role -otp -otp_expiry_time",
        },
        { path: "messages" },
      ]
    );

    return res.status(201).json({
      success: true,
      data: newConversation,
    });
  }
});

const getConversations = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user) throw new Error("Không tìm thấy người dùng.");

  const conversations = await Conversation.find({
    participants: { $in: [id] },
  }).populate([
    {
      path: "participants",
      select: "-verified -password -role -otp -otp_expiry_time",
    },
    { path: "messages" },
  ]);

  return res.status(conversations.length ? 200 : 404).json({
    success: !!conversations.length,
    mes: !conversations.length
      ? "Không tìm thấy cuộc hội thoại nào."
      : undefined,
    data: conversations.length ? conversations : undefined,
  });
});

module.exports = { startConversation, getConversations };
