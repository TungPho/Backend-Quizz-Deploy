const documentModel = require("../models/document.model");
const DocumentService = require("../services/document.service");

class DocumentController {
  getDocumentByUserId = async (req, res, next) => {
    const { userId } = req.params;
    const result = await DocumentService.getDocumentsByUserId(userId);
    res.status(200).json({
      message: "Get All Documents by user id successful",
      metadata: result,
    });
  };

  getDocumentByClassId = async (req, res, next) => {
    const { classId } = req.params;
    const result = await DocumentService.getDocumentByClassId(classId);
    res.status(200).json({
      message: "Get All Documents by class id successful",
      metadata: result,
    });
  };

  uploadPDFDocument = async (req, res, next) => {
    if (!req.file) {
      throw new Error("Error when uploading files");
    }
    const { classId, teacherId } = req.body;
    const newDocument = {
      teacherId,
      classId,
      fileName: req.file.originalname,
      fileUrl: req.file.path, // Cloudinary URL
      fileType: "pdf",
      size: req.file.size,
    };
    console.log(newDocument);
    const createdDoc = await documentModel.create(newDocument);
    res.status(201).json({
      message: "Upload New PDF Document Successfully",
      metadata: createdDoc,
    });
  };
  deleteDocumentById = async (req, res, next) => {
    const { documentId } = req.params;
    const result = await DocumentService.deleteDocumentById(documentId);
    res.status(200).json({
      message: "Delete A Document Successfully",
      metadata: result,
    });
  };
}

module.exports = new DocumentController();
