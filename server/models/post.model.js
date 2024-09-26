const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var postSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Postedby is required."],
    },
    context: {
      type: String,
      maxLength: [500, "Context no more than 500 characters."],
    },
    fileUrls: [
      {
        type: { type: String, enum: ["IMAGE", "VIDEO"] },
        url: { type: String },
      },
    ],
    filenames: [{ type: String }],
    likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    bookmarkedUsers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    comments: [
      {
        userId: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          required: [true, "Userid commnet is required."],
        },
        context: {
          type: String,
          required: [true, "Context comment is required."],
        },
        likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Post", postSchema);
