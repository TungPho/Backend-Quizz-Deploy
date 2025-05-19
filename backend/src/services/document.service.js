const documentModel = require("../models/document.model");

class DocumentService {
  static getDocumentsByUserId = async (userId) => {
    const results = await documentModel.find({ teacherId: userId });
    return results;
  };
  static getDocumentByClassId = async (classId) => {
    const results = await documentModel.find({ classId });
    return results;
  };
  static deleteDocumentById = async (documentId) => {
    const results = await documentModel.findByIdAndDelete(documentId);
    if (!results) throw new Error("Error delete this document");
    return results;
  };
  static uploadDocument = async () => {
    return {};
  };
}
module.exports = DocumentService;
