const router = require("express").Router();
const conversationController = require("../controllers/conversation.controller");
const { verifyAccessToken } = require("../middlewares/verifyToken");

router.get(
  "/get-conversation",
  [verifyAccessToken],
  conversationController.getConversations
);
router.post(
  "/start-conversation/:uid",
  [verifyAccessToken],
  conversationController.startConversation
);

module.exports = router;
