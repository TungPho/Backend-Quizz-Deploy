const express = require("express");
const catchAsync = require("../../handlers/asyncHandlers");
const examProgressController = require("../../controllers/exam.progress.controllers");

const examProgressRoute = express.Router();

examProgressRoute.post(
  "/exam_progress/:userId",
  catchAsync(examProgressController.createProgress)
);

//get progress of student's id
examProgressRoute.get(
  "/exam_progress/:userId",
  catchAsync(examProgressController.getExamProgressByStudentId)
);

//delete progress of student's id
examProgressRoute.delete(
  "/exam_progress/:userId",
  catchAsync(examProgressController.deleteExamProgressByStudentId)
);
module.exports = examProgressRoute;
