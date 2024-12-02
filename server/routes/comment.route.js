const router = require("express").Router();
const commentController = require("../controllers/comment.controller");
const { verifyAccessToken } = require("../middlewares/verifyToken");

router.put(
  "/like-unlike/:cid",
  [verifyAccessToken],
  commentController.likeUnlikeComment
);
router.post("/:postId", [verifyAccessToken], commentController.createComment);
router.get("/:postId", [verifyAccessToken], commentController.getAllComments);
router.put("/:cid", [verifyAccessToken], commentController.updateComment);
router.delete("/:cid", [verifyAccessToken], commentController.deleteComment);

module.exports = router;
