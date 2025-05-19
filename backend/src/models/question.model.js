const { model, Schema, Types } = require("mongoose");
const COLLECTION_NAME = "Questions";
const DOCUMENT_NAME = "Question";
// Đây là từng câu hỏi
// "options": [
//     {
//       "index" : number
//       "text": "string", // Nội dung của lựa chọn
//       "isCorrect": "boolean" // Lựa chọn đúng hay sai
//     }
//   ],

const QuestionSchema = Schema(
  {
    quizId: {
      type: Types.ObjectId,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    options: {
      type: [],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
const questionModel = model(DOCUMENT_NAME, QuestionSchema, COLLECTION_NAME);
module.exports = questionModel;
