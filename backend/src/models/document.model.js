const { model, Schema, Types } = require("mongoose");
const DOCUMENT_NAME = "Document";
const COLLECTION_NAME = "Documents";

const DocumentSchema = new Schema(
  {
    teacherId: {
      type: String,
      required: true,
    },
    classId: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ["pdf", "png", "jpg", "doc", "docx"],
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

const documentModel = model(DOCUMENT_NAME, DocumentSchema, COLLECTION_NAME);
module.exports = documentModel;
