const Post = require("../models/post.model");
const User = require("../models/user.model");
const Activity = require("../models/activity.model");
const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;

const createPost = asyncHandler(async (req, res) => {
  const { postedBy, context } = req.body;
  const { id } = req.user;

  if (!postedBy) throw new Error("Người đăng là bắt buộc.");

  const user = await User.findById(postedBy);
  if (!user)
    res.status(404).json({ success: false, mes: "Không tìm thấy người dùng." });

  if (user._id.toString() !== id)
    res.status(401).json({
      success: false,
      mes: "Không được phép tạo bài đăng.",
    });

  const maxlength = 500;
  if (context && context.length > maxlength)
    throw new Error(`Nội dung phải ít hơn ${maxlength} ký tự.`);

  const newPost = await Post.create({ postedBy, context });
  let getPost;
  if (newPost)
    getPost = await Post.findById(newPost._id).populate([
      {
        path: "postedBy",
        select: "-verified -password -role -otp -otp_expiry_time",
      },
      {
        path: "comments.userId",
        select: "-verified -password -role -otp -otp_expiry_time",
      },
    ]);

  return res.status(newPost ? 200 : 500).json({
    success: newPost ? true : false,
    mes: newPost
      ? "Bài viết đã được tạo thành công."
      : "Không tạo được bài viết.",
    data: newPost ? getPost : undefined,
  });
});

const uploadFiles = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { id } = req.user;

  const post = await Post.findById(postId);
  if (!post) {
    cloudinary.api.delete_resources(
      req?.files?.filePosts?.map((filePost) => filePost.filename)
    );
    return res
      .status(404)
      .json({ success: false, mes: "Bài viết không tìm thấy." });
  }
  if (post.postedBy._id.toString() !== id) {
    cloudinary.api.delete_resources(
      req?.files?.filePosts?.map((filePost) => filePost.filename)
    );
    return res
      .status(404)
      .json({ success: false, mes: "Tài khoản không hợp lệ." });
  }

  if (req?.files) {
    const filenames = req.files.filePosts.map((filePost) => filePost.filename);
    const fileUrls = req.files.filePosts.map((filePost) => ({
      type: filePost.mimetype.split("/")[0].toUpperCase(),
      url: filePost.path,
    }));

    const uploadFilesPost = await Post.findByIdAndUpdate(
      postId,
      { fileUrls, filenames },
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
    ]);

    if (!uploadFilesPost) {
      cloudinary.api.delete_resources(
        req?.files?.filePosts?.map((filePost) => filePost.filename)
      );
      throw new Error("Không tải được tệp lên.");
    }
    if (uploadFilesPost && post.filenames && post.filenames.length) {
      cloudinary.api.delete_resources(post.filenames);
      cloudinary.api.delete_resources(post.filenames, {
        resource_type: "video",
      });
    }

    return res.status(200).json({
      success: true,
      mes: "Đã tải tập tin thành công.",
      data: uploadFilesPost,
    });
  } else
    return res.status(500).json({
      success: false,
      mes: "Yêu cầu chưa có tập tin.",
    });
});

const updatePost = asyncHandler(async (req, res) => {
  const { context } = req.body;
  const { postId } = req.params;

  if (!postId) throw new Error("Mã bài đăng là bắt buộc.");

  const post = await Post.findById(postId).populate([
    {
      path: "postedBy",
      select:
        "-verified -password -role -otp -otp_expiry_time -filename -updatedAt",
    },
  ]);
  if (!post)
    return res
      .status(404)
      .json({ success: false, mes: "Bài viết không tìm thấy." });

  if (post.postedBy._id.toString() !== req.user.id)
    return res.status(401).json({
      success: false,
      mes: "Không được phép cập nhật bài viết.",
    });

  const maxlength = 500;
  if (context && context.length > maxlength)
    throw new Error(`Nội dung phải ít hơn ${maxlength} ký tự.`);

  post.context = context;
  const updatedPost = await post.save({
    new: true,
    validateModifiedOnly: true,
  });

  return res
    .status(200)
    .json({ success: true, mes: "Đã cập nhật bài đăng.", data: updatedPost });
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId) throw new Error("Mã bài đăng là bắt buộc.");

  const post = await Post.findById(postId);
  if (!post)
    return res
      .status(404)
      .json({ success: false, mes: "Bài viết không tìm thấy." });

  if (post.postedBy._id.toString() !== req.user.id)
    return res.status(401).json({
      success: false,
      mes: "Không được phép xóa bài viết.",
    });

  const deletedPost = await Post.findByIdAndDelete(postId);

  if (deletedPost && post.filenames && post.filenames.length) {
    cloudinary.api.delete_resources(post.filenames);
    cloudinary.api.delete_resources(post.filenames, { resource_type: "video" });
  }

  return res.status(200).json({ success: true, mes: "Đã xóa bài đăng." });
});

const likeUnlikePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { id } = req.user;

  if (!postId) throw new Error("Mã bài đăng là bắt buộc.");

  const post = await Post.findById(postId).populate([
    {
      path: "postedBy",
      select:
        "-verified -password -role -otp -otp_expiry_time -filename -updatedAt",
    },
  ]);
  if (!post)
    return res
      .status(404)
      .json({ success: false, mes: "Bài viết không tìm thấy." });

  const userLikedPost = post.likes.includes(id);

  if (userLikedPost) {
    // unlike
    const unlike = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: id } },
      { new: true, validateModifiedOnly: true }
    ).populate([
      {
        path: "postedBy",
        select:
          "-verified -password -role -otp -otp_expiry_time -filename -updatedAt",
      },
    ]);
    if (unlike) {
      await User.findByIdAndUpdate(id, { $pull: { likedPosts: postId } });
      await Activity.deleteMany({
        isSuerId: id,
        recipientId: unlike.postedBy._id,
        postId,
        type: "Like",
      });
    }
    return res.status(unlike ? 200 : 404).json({
      success: !!unlike,
      mes: unlike
        ? "Hủy like bài đăng thành công."
        : "Hủy like bài đăng thất bại.",
      data: unlike ? unlike : undefined,
    });
  } else {
    // like
    post.likes.push(id);
    const like = await post.save({ new: true, validateModifiedOnly: true });
    if (like) {
      await User.findByIdAndUpdate(id, { $push: { likedPosts: postId } });
      await Activity.create({
        isSuerId: id,
        recipientId: like.postedBy._id,
        postId,
        type: "Like",
      });
    }
    return res.status(like ? 200 : 404).json({
      success: !!like,
      mes: like ? "Like bài đăng thành công." : "Like bài đăng thất bại.",
      data: like ? like : undefined,
    });
  }
});

const createCommentPost = asyncHandler(async (req, res) => {
  const { context } = req.body;
  const { postId } = req.params;
  const { id } = req.user;

  if (!context) throw new Error("Cần phải có ngữ cảnh.");

  const post = await Post.findById(postId);
  if (!post)
    return res
      .status(404)
      .json({ success: false, mes: "Bài viết không tìm thấy." });

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

  if (createdCommnet && post.postedBy.toString() !== id)
    await Activity.create({
      isSuerId: id,
      recipientId: createdCommnet.postedBy._id,
      commentId:
        createdCommnet.comments[createdCommnet.comments.length - 1]._id,
      postId,
      type: "Comment",
    });

  res.status(200).json({
    success: true,
    mes: "Đã bình luận thành công.",
    data: createdCommnet,
  });
});

const updateCommentPost = asyncHandler(async (req, res) => {
  const { context } = req.body;
  const { postId, commentId } = req.params;
  const { id } = req.user;

  if (!context)
    throw new Error("Cần phải có ID bài đăng, ngữ cảnh và ID bình luận.");

  const post = await Post.findById(postId);
  if (!post)
    return res
      .status(404)
      .json({ success: false, mes: "Bài viết không tìm thấy." });

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
    mes: "Bình luận đã được cập nhật thành công.",
    data: updatedComment,
  });
});

const liekUnlikeCommentPost = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  const { id } = req.user;

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
    return res
      .status(404)
      .json({ success: false, mes: "Bài viết không tìm thấy." });

  const userLikedComment = post.comments
    .find((comment) => comment._id.toString() === commentId)
    .likes.includes(id);

  if (userLikedComment) {
    // unlike comment
    const unlikeComment = await Post.findOneAndUpdate(
      {
        _id: postId,
        "comments._id": commentId,
        "comments.likes": id,
      },
      { $pull: { "comments.$.likes": id } },
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

    if (unlikeComment)
      await Activity.deleteMany({
        isSuerId: id,
        recipientId: unlikeComment.postedBy._id,
        commentId,
        postId,
        type: "Like_Comment",
      });

    return res.status(unlikeComment ? 200 : 404).json({
      success: !!unlikeComment,
      mes: unlikeComment
        ? "Hủy like bình luận thành công."
        : "Hủy like bình luận thất bại.",
      data: unlikeComment ? unlikeComment : undefined,
    });
  } else {
    // like comment
    post.comments
      .find((comment) => comment._id.toString() === commentId)
      .likes.push(id);
    const likeComment = await post.save({
      new: true,
      validateModifiedOnly: true,
    });

    if (likeComment)
      await Activity.create({
        isSuerId: id,
        recipientId: likeComment.postedBy._id,
        commentId,
        postId,
        type: "Like_Comment",
      });

    return res.status(likeComment ? 200 : 404).json({
      success: !!likeComment,
      mes: likeComment
        ? "Like bình luận thành công."
        : "Like bình luận thất bại.",
      data: likeComment ? likeComment : undefined,
    });
  }
});

const deleteCommentPost = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  const { id } = req.user;

  if (!postId || !commentId)
    throw new Error("Cần phải có ID bài đăng và ID bình luận.");

  const post = await Post.findById(postId);
  if (!post)
    return res
      .status(404)
      .json({ success: false, mes: "Bài viết không tìm thấy." });

  const userComment = post.comments
    .map((comment) => comment.userId.toString())
    .includes(id);
  if (!userComment)
    return res.status(401).json({
      success: false,
      mes: "Không được phép xóa bài bình luận.",
    });

  const delete_comment = await Post.findOneAndUpdate(
    {
      _id: postId,
      "comments.userId": id,
      "comments._id": commentId,
    },
    { $pull: { comments: { _id: commentId } } },
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

  if (delete_comment) {
    await Activity.deleteMany({
      isSuerId: id,
      recipientId: delete_comment.postedBy._id,
      commentId,
      postId,
      type: "Like_Comment",
    });
    await Activity.deleteMany({
      isSuerId: id,
      recipientId: delete_comment.postedBy._id,
      commentId,
      postId,
      type: "Comment",
    });
  }

  return res.status(200).json({
    success: true,
    mes: "Bình luận đã được xóa thành công.",
    data: delete_comment,
  });
});

const getFeedPosts = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const queries = { ...req.query };
  const pageSize = 10;

  const user = await User.findById(id);
  if (!user)
    return res.status(404).json({ error: "Không tìm thấy người dùng." });

  const objectQueries = {};
  objectQueries.postedBy = { $nin: user.blockedUsers };
  if (queries.cursor) objectQueries._id = { $lt: queries.cursor };
  if (queries.follower) objectQueries.postedBy = { $in: user.following };
  else if (queries.likes) objectQueries._id = { $in: user.likedPosts };
  else if (queries.bookmarks) objectQueries._id = { $in: user.bookmarkedPosts };

  const posts = await Post.find(objectQueries)
    .populate([
      {
        path: "postedBy",
        select:
          "-verified -password -role -otp -otp_expiry_time -filename -updatedAt",
      },
    ])
    .sort({ createdAt: -1 });
  // .limit(pageSize + 1);

  const nextCursor = posts.length > pageSize ? posts[pageSize]._id : null;
  const count = await Post.find(objectQueries).countDocuments();

  res.status(posts.length ? 200 : 404).json({
    success: posts.length ? true : false,
    mes: !posts.length ? "Bài viết không tìm thấy." : undefined,
    data: posts.length ? posts : undefined,
    count,
    nextCursor,
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
    return res
      .status(404)
      .json({ success: false, mes: "Bài viết không tìm thấy." });

  return res.status(200).json({
    success: true,
    data: post,
  });
});

const getUserPosts = asyncHandler(async (req, res) => {
  const { userName } = req.params;
  const { id } = req.user;

  const userToModify = await User.findOne({ userName: userName });
  const currentUser = await User.findById(id);
  if (!userToModify || !currentUser)
    return res.status(404).json({ error: "Không tìm thấy người dùng." });
  if (currentUser.blockedUsers.includes(userToModify._id))
    throw new Error("Người dùng nãy đã bị chặn.");

  const posts = await Post.find({ postedBy: userToModify._id })
    .populate([
      {
        path: "postedBy",
        select: "-verified -password -role -otp -otp_expiry_time",
      },
    ])
    .sort({ createdAt: -1 });

  res.status(posts.length ? 200 : 404).json({
    success: posts.length ? true : false,
    mes: !posts.length ? "Bài viết không tìm thấy." : undefined,
    data: posts.length ? posts : undefined,
  });
});

module.exports = {
  createPost,
  uploadFiles,
  updatePost,
  deletePost,
  likeUnlikePost,
  createCommentPost,
  updateCommentPost,
  deleteCommentPost,
  getFeedPosts,
  getPost,
  getUserPosts,
  liekUnlikeCommentPost,
};
