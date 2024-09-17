const router = require("express").Router();
const postController = require("../controllers/post");
const { verifyAccessToken } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");

router.post("/", verifyAccessToken, postController.createPost);
router.put("/", verifyAccessToken, postController.updatePost);
router.get("/feed", verifyAccessToken, postController.getFeedPosts);

router.put(
  "/upload-files",
  [verifyAccessToken, uploader.fields([{ name: "filePosts", maxCount: 10 }])],
  postController.uploadFiles
);

router.put(
  "/create-comment",
  verifyAccessToken,
  postController.createCommentPost
);
router.put(
  "/update-comment",
  verifyAccessToken,
  postController.updateCommentPost
);
router.delete(
  "/delete-comment/:postId/:commentId",
  verifyAccessToken,
  postController.deleteCommentPost
);

router.put(
  "/like-unlike/:postId",
  verifyAccessToken,
  postController.likeUnlikePost
);

router.put(
  "/bookmark-unbookmark/:postId",
  verifyAccessToken,
  postController.bookmarkUnBookmark
);

router.get(
  "/user-post/:userName",
  verifyAccessToken,
  postController.getUserPosts
);
router.delete("/:postId", verifyAccessToken, postController.deletePost);
router.get("/:postId", verifyAccessToken, postController.getPost);

module.exports = router;
