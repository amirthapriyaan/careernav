
const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true }
}, { _id: false });

const AnalysisSchema = new mongoose.Schema({
  jobDescription: String,
  resumeText: String,
  score: Number,
  strengths: [String],
  gaps: [String],
  atsHints: [String],
  interviewQs: [String],
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const RoadmapStepSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, default: 'other' },
  status: { type: String, enum: ['todo','doing','done'], default: 'todo' },
  notes: String,
  description: String,
  suggestedResources: { type: [ResourceSchema], default: [] },
  projectIdea: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { _id: false });

const RoadmapSchema = new mongoose.Schema({
  title: { type: String, default: 'Learning Roadmap' },
  steps: { type: [RoadmapStepSchema], default: [] },
  updatedAt: { type: Date, default: Date.now }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastAnalyses: { type: [AnalysisSchema], default: [] },
  roadmap: { type: RoadmapSchema, default: () => ({}) },
  usage: {
    analysesCount: { type: Number, default: 0 },
    lastLogin: Date
  }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
