const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Conversation", conversationSchema);
