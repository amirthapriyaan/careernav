const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    from: { type: String, enum: ["user", "bot"], required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const ChatSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, default: "New Conversation" },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
