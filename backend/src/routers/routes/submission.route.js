const express = require("express");
const catchAsync = require("../../handlers/asyncHandlers");
const submissionController = require("../../controllers/submission.controllers");
const submissionRoute = express.Router();

submissionRoute.get(
  "/submissions/:id",
  catchAsync(submissionController.getAllSubmisionByUserId)
);
//
submissionRoute.get(
  "/get_submissions_by_roomId/:roomId",
  catchAsync(submissionController.getSubmissionByRoomID)
);
submissionRoute.post(
  "/submissions",
  catchAsync(submissionController.createSumission)
);

module.exports = submissionRoute;
