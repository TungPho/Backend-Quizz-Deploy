const express = require("express");
const upload = require("../../configs/multer.config");
const documentControllers = require("../../controllers/document.controllers");
const catchAsync = require("../../handlers/asyncHandlers");

const documentRoute = express.Router();

documentRoute.get(
  "/documents/:userId",
  catchAsync(documentControllers.getDocumentByUserId)
);

documentRoute.get(
  "/class_documents/:classId",
  catchAsync(documentControllers.getDocumentByClassId)
);
documentRoute.post(
  "/documents",
  upload.single("pdf"),
  catchAsync(documentControllers.uploadPDFDocument)
);
documentRoute.delete(
  "/documents/:documentId",
  catchAsync(documentControllers.deleteDocumentById)
);
module.exports = documentRoute;
