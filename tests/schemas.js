
import mongoose from "mongoose";

const baseLabSchema = new mongoose.Schema(
  {
    lab_name: { type: String, required: true, unique: true },
    course_id: { type: mongoose.Types.ObjectId, ref: "Course", required: true },
    semester: { type: Number },
    teachers: [{ type: mongoose.Types.ObjectId, ref: "User", required: true }],
    students: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    modules: [{ type: mongoose.Types.ObjectId, ref: "Question" }],
    labType: { type: String, required: true },
  },
  { timestamps: true, discriminatorKey: "labType" }
);

const Lab = mongoose.model("Lab", baseLabSchema);

export { Lab, CNLab };

import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  description: { type: String },
  points: { type: Number, default: 0 },
}, { _id: false });

const baseQuestionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    lab: { type: mongoose.Types.ObjectId, ref: "Lab", required: true },
    maxMarks: { type: Number, default: 10 },
    moduleType: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true, discriminatorKey: "moduleType" }
);

const baseSubmissionSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    lab: { type: mongoose.Types.ObjectId, ref: "Lab", required: true },	
	module: { type: mongoose.Types.ObjectId, ref: "Lab", required: true },
    question: { type: mongoose.Types.ObjectId, ref: "Question", required: true },
    marks: { type: Number, default: 0 },
    submissionType: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'evaluating', 'completed', 'error'],
      default: 'pending'
    },
    attempts: { type: Number, default: 1 },
    feedback: { type: String },
  },
  { timestamps: true, discriminatorKey: "submissionType" }
);





