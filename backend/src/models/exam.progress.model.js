const { Schema, Types, model } = require("mongoose");

const COLLECTION_NAME = "ExamProgress";
const DOCUMENT_NAME = "ExamProgress";
const ExamProgressSchema = Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    student_name: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    examName: {
      type: String,
      required: true,
    },
    violation_number: {
      type: Number,
      required: true,
    },
    examId: {
      type: String,
      required: true,
    },
    remainingTime: { type: Number, required: true }, // Tính bằng giây
    answers: {
      type: Object,
    },
    startTime: { type: String, required: true, default: "" },
    endTime: { type: String, required: true, default: "" },
    status: {
      type: String,
      enum: ["in_progress", "submitted", "expired"],
      default: "in_progress",
    },
  },
  { timestamps: true }
);

module.exports = model(DOCUMENT_NAME, ExamProgressSchema, COLLECTION_NAME);
