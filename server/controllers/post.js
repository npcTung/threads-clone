const Post = require("../models/post");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;

const createPost = asyncHandler(async (req, res) => {
  const { postedBy, context } = req.body;

  if (!postedBy) throw new Error("Postedby is required.");

  const user = await User.findById(postedBy);
  if (!user) res.status(404).json({ success: false, mes: "User not found." });

  if (user._id.toString() !== req.user.id)
    res.status(401).json({
      success: false,
      mes: "Unauthorized to create post.",
    });

  const maxlength = 500;
  if (context && context.length > maxlength)
    throw new Error(`Context must be less than ${maxlength} characters`);

  const newPost = await Post.create({ postedBy, context });

  return res.status(newPost ? 200 : 500).json({
    success: newPost ? true : false,
    mes: newPost ? "Post created successfully" : "Failed to create post.",
    data: newPost ? newPost : undefined,
  });
});

const uploadFiles = asyncHandler(async (req, res) => {
  const { postId } = req.body;

  if (!postId) {
    cloudinary.api.delete_resources(
      req?.files?.filePosts?.map((filePost) => filePost.filename)
    );
    throw new Error("Post id is required.");
  }

  const post = await Post.findById(postId);
  if (!post) {
    cloudinary.api.delete_resources(
      req?.files?.filePosts?.map((filePost) => filePost.filename)
    );
    return res.status(404).json({ success: false, mes: "Post not found." });
  }

  let filesUrl;
  let filenames;
  if (req?.files) {
    filesUrl = req.files.filePosts.map((filePost) => filePost.path);
    filenames = req.files.filePosts.map((filePost) => filePost.filename);
  }

  const uploadFilesPost = await Post.findByIdAndUpdate(
    postId,
    { filesUrl, filenames },
    {
      new: true,
      validateModifiedOnly: true,
    }
  ).populate([
    {
      path: "postedBy",
      select:
        "-verified -password -role -otp -otp_expiry_time -filename -updatedAt",
    },
    {
      path: "comments.userId",
      select:
        "-verified -password -role -otp -otp_expiry_time -filename -updatedAt",
    },
  ]);

  if (!uploadFilesPost) {
    cloudinary.api.delete_resources(
      req?.files?.filePosts?.map((filePost) => filePost.filename)
    );
    throw new Error("Failed to upload files.");
  }
  if (uploadFilesPost && post.filenames && post.filenames.length)
    cloudinary.api.delete_resources(post.filenames);

  return res.status(200).json({
    success: true,
    mes: "Files uploaded successfully.",
    data: uploadFilesPost ? uploadFilesPost : undefined,
  });
});

const updatePost = asyncHandler(async (req, res) => {
  const { postId, context } = req.body;

  if (!postId) throw new Error("Post id is required.");

  const post = await Post.findById(postId).populate([
    {
      path: "postedBy",
      select:
        "-verified -password -role -otp -otp_expiry_time -filename -updatedAt",
    },
    {
      path: "comments.userId",
      select:
        "-verified -password -role -otp -otp_expiry_time -filename -updatedAt",
    },
  ]);
  if (!post)
    return res.status(404).json({ success: false, mes: "Post not found." });

  if (post.postedBy._id.toString() !== req.user.id)
    return res.status(401).json({
      success: false,
      mes: "Unauthorized to update post.",
    });

  const maxlength = 500;
  if (context && context.length > maxlength)
    throw new Error(`Context must be less than ${maxlength} characters`);

  post.context = context;
  const updatedPost = await post.save({
    new: true,
    validateModifiedOnly: true,
  });

  return res
    .status(200)
    .json({ success: true, mes: "Updated posted.", data: updatedPost });
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId) throw new Error("Post id is required.");

  const post = await Post.findById(postId);
  if (!post)
    return res.status(404).json({ success: false, mes: "Post not found." });

  if (post.postedBy._id.toString() !== req.user.id)
    return res.status(401).json({
      success: false,
      mes: "Unauthorized to delete post.",
    });

  const deletedPost = await Post.findByIdAndDelete(postId);

  if (deletedPost && post.filenames && post.filenames.length)
    cloudinary.api.delete_resources(post.filenames);

  return res.status(200).json({ success: true, mes: "Deleted posted." });
});

const likeUnlikePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { id } = req.user;

  if (!postId) throw new Error("Post id is required.");

  const post = await Post.findById(postId);
  if (!post)
    return res.status(404).json({ success: false, mes: "Post not found." });

  if (post.postedBy._id.toString() !== req.user.id)
    return res.status(401).json({
      success: false,
      mes: "Unauthorized to like and unlike post.",
    });

  const userLikedPost = post.likes.includes(id);

  if (userLikedPost) {
    // unlike
    await Post.findByIdAndUpdate(postId, { $pull: { likes: id } });
    res.status(200).json({ success: true, mes: "Post unliked successfully" });
  } else {
    // like
    post.likes.push(id);
    await post.save();
    return res
      .status(200)
      .json({ success: true, mes: "Post liked successfully" });
  }
});

const bookmarkUnBookmark = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { id } = req.user;

  if (!postId) throw new Error("Post id is required.");

  const post = await Post.findById(postId);
  if (!post)
    return res.status(404).json({ success: false, mes: "Post not found." });

  const userBookmarked = post.bookmarkedUsers.includes(id);

  if (userBookmarked) {
    // unbookmark
    await Post.findByIdAndUpdate(postId, { $pull: { bookmarkedUsers: id } });
    res
      .status(200)
      .json({ success: true, mes: "Post unbookmarked successfully" });
  } else {
    // bookmark
    post.bookmarkedUsers.push(id);
    await post.save();
    return res
      .status(200)
      .json({ success: true, mes: "Post bookmarked successfully" });
  }
});

const createCommentPost = asyncHandler(async (req, res) => {
  const { postId, context } = req.body;
  const { id } = req.user;

  if (!postId || !context) throw new Error("Post id and context is required.");

  const post = await Post.findById(postId);
  if (!post)
    return res.status(404).json({ success: false, mes: "Post not found." });

  if (post.postedBy._id.toString() !== req.user.id)
    return res.status(401).json({
      success: false,
      mes: "Unauthorized to create comment post.",
    });

  const createdCommnet = await Post.findByIdAndUpdate(
    postId,
    {
      $push: { comments: { context, userId: id } },
    },
    { new: true, validateModifiedOnly: true }
  ).populate([
    {
      path: "postedBy",
      select:
        "-verified -password -role -otp -otp_expiry_time -filename -updatedAt",
    },
    {
      path: "comments.userId",
      select:
        "-verified -password -role -otp -otp_expiry_time -filename -updatedAt",
    },
  ]);

  res.status(200).json({
    success: true,
    mes: "Commented successfully.",
    data: createdCommnet.comments,
  });
});

const updateCommentPost = asyncHandler(async (req, res) => {
  const { postId, context, commentId } = req.body;
  const { id } = req.user;

  if (!postId || !context || !commentId)
    throw new Error("Post id, context and comment id is required.");

  const post = await Post.findById(postId);
  if (!post)
    return res.status(404).json({ success: false, mes: "Post not found." });

  if (post.postedBy._id.toString() !== req.user.id)
    return res.status(401).json({
      success: false,
      mes: "Unauthorized to update comment post.",
    });

  const updatedComment = await Post.findOneAndUpdate(
    {
      _id: postId,
      "comments._id": commentId,
      "comments.userId": id,
    },
    { $set: { "comments.$.context": context } },
    { new: true, validateModifiedOnly: true }
  ).populate([
    {
      path: "postedBy",
      select:
        "-verified -password -role -otp -otp_expiry_time -filename -updatedAt",
    },
    {
      path: "comments.userId",
      select:
        "-verified -password -role -otp -otp_expiry_time -filename -updatedAt",
    },
  ]);

  return res.status(200).json({
    success: true,
    mes: "Comment updated successfully",
    data: updatedComment ? updatedComment.comments : undefined,
  });
});

const deleteCommentPost = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  const { id } = req.user;

  if (!postId || !commentId)
    throw new Error("Post id and comment id is required.");

  const post = await Post.findById(postId);
  if (!post)
    return res.status(404).json({ success: false, mes: "Post not found." });

  if (post.postedBy._id.toString() !== req.user.id)
    return res.status(401).json({
      success: false,
      mes: "Unauthorized to delete comment post.",
    });

  await Post.findOneAndUpdate(
    {
      _id: postId,
      "comments.userId": id,
      "comments._id": commentId,
    },
    { $pull: { comments: { _id: commentId } } }
  );

  return res.status(200).json({
    success: true,
    mes: "Comment deleted successfully",
  });
});

const getFeedPosts = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const posts = await Post.find({ postedBy: { $in: user.following } })
    .populate([
      {
        path: "postedBy",
        select:
          "-verified -password -role -otp -otp_expiry_time -filename -updatedAt",
      },
      {
        path: "comments.userId",
        select:
          "-verified -password -role -otp -otp_expiry_time -filename -updatedAt",
      },
    ])
    .sort({ createdAt: -1 });

  res.status(posts.length ? 200 : 404).json({
    success: posts.length ? true : false,
    mes: !posts.length ? "Posts not found." : undefined,
    data: posts.length ? posts : undefined,
  });
});

const getPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId).populate([
    {
      path: "postedBy",
      select: "-verified -password -role -otp -otp_expiry_time",
    },
    {
      path: "comments.userId",
      select: "-verified -password -role -otp -otp_expiry_time",
    },
  ]);

  if (!post)
    return res.status(404).json({ success: false, mes: "Post not found." });

  res.status(post ? 200 : 404).json({
    success: post ? true : false,
    mes: !post ? "Post not found." : undefined,
    data: post ? post : undefined,
  });
});

const getUserPosts = asyncHandler(async (req, res) => {
  const { userName } = req.params;

  const user = await User.findOne({ userName: userName });
  if (!user) return res.status(404).json({ error: "User not found" });

  const posts = await Post.find({ postedBy: user._id })
    .populate([
      {
        path: "postedBy",
        select: "-verified -password -role -otp -otp_expiry_time",
      },
      {
        path: "comments.userId",
        select: "-verified -password -role -otp -otp_expiry_time",
      },
    ])
    .sort({ createdAt: -1 });

  res.status(posts.length ? 200 : 404).json({
    success: posts.length ? true : false,
    mes: !posts.length ? "Posts not found." : undefined,
    data: posts.length ? posts : undefined,
  });
});

module.exports = {
  createPost,
  uploadFiles,
  updatePost,
  deletePost,
  likeUnlikePost,
  bookmarkUnBookmark,
  createCommentPost,
  updateCommentPost,
  deleteCommentPost,
  getFeedPosts,
  getPost,
  getUserPosts,
};
