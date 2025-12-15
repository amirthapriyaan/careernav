const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "bot"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "New Career Chat",
    },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
