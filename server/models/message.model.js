const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var messageSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    medias: [
      {
        type: { type: String, enum: ["image", "video"] },
        url: String,
        filename: String,
      },
    ],
    audio: { url: String, filename: String },
    giphyUrl: String,
    document: { url: String, name: String, size: Number, filename: String },
    type: { type: String, enum: ["Media", "Text", "Doc", "Giphy", "Audio"] },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Message", messageSchema);
