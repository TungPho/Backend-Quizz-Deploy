const { model, Schema, Types } = require("mongoose");
const COLLECTION_NAME = "Classes";
const DOCUMENT_NAME = "Class";

const ClassSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // id của user (thầy) tạo lớp
    teacherId: {
      type: String,
      required: true,
    },
    students: {
      type: [],
      default: [],
    },
    // danh sách bài kiểm tra thuộc lớp
    tests: {
      type: [],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
const classModel = model(DOCUMENT_NAME, ClassSchema, COLLECTION_NAME);
module.exports = classModel;
