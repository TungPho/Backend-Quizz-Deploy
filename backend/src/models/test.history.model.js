const mongoose = require("mongoose");

const COLLECTION_NAME = "TestHistory";
const DOCUMENT_NAME = "TestHistory";

const testHistorySchema = new mongoose.Schema(
  {
    testName: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      required: true,
    },
    classId: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    teacherId: {
      type: String,
      required: true,
    },
    numberOfSubmissions: {
      type: Number,
      required: true,
      default: 0,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    scores: [
      {
        userId: {
          type: String,
          required: true,
        },
        score: {
          type: Number,
          required: true,
        },
      },
    ],
    averageScore: {
      type: Number,
      default: 0,
    },
    highestScore: {
      type: Number,
      default: 0,
    },
    lowestScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, testHistorySchema);
