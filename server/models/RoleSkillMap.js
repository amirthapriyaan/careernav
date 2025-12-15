
const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema(
  {
    title: String,
    url: String,
    type: String // "video" | "doc" | "course"
  },
  { _id: false }
);

const RoleSkillMapSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, unique: true }, // "frontend", "backend", etc.
    displayName: { type: String }, // "Frontend Developer"
    coreSkills: [String],
    tools: [String],
    resources: [ResourceSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoleSkillMap", RoleSkillMapSchema);
