// 1. có thể tạo bài test rỗng rồi tạo question -> add lần lượt vào thông qua phương thức update
const { model, Schema, Types } = require("mongoose");
const COLLECTION_NAME = "Tests";
const DOCUMENT_NAME = "Test";
// quizzes
const TestSchema = Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Untitled Test",
    },
    classId: {
      type: String,
      default: "",
    },
    teacherId: {
      type: String,
      default: "",
    },
    questions: {
      type: [],
      default: [],
    },
    timeLimit: {
      type: Number,
      required: true,
      default: 15,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
const testModel = model(DOCUMENT_NAME, TestSchema, COLLECTION_NAME);
module.exports = testModel;
