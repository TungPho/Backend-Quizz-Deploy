const { model, Types, Schema } = require("mongoose");

// Giáo viên xem test history -> Xem ai đã nộp,
// click chi tiết -> ra submission của từng người
const COLLECTION_NAME = "Submssions";
const DOCUMENT_NAME = "Submission";
// answers có dạng

// phải JSON.stringify cái này!
// {
//   [currentQuestion]: {
//     optionSelected: index,
//     isSelected: true,
//     isCorrect: questions[currentQuestion].options[index].isCorrect,
//   },
//   0 : {
//     optionSelected: 1,
//     isSelected: true,
//     isCorrect: false,
// }

const SubmissionSchema = Schema(
  {
    testId: {
      type: String,
      required: true,
    },
    testName: {
      type: String,
      required: true,
    },
    userName: { type: String, required: true },
    userId: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    answers: {
      type: Object,
      default: [],
    },
    score: {
      type: Number,
      default: 0,
      required: true,
    },
    number_of_correct_options: {
      type: Number,
      required: true,
    },
    number_of_wrong_options: {
      type: Number,
      default: 0,
      required: true,
    },
    submitted_at: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
module.exports = model(DOCUMENT_NAME, SubmissionSchema, COLLECTION_NAME);
