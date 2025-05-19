const express = require("express");
const catchAsync = require("../../handlers/asyncHandlers");

const aiController = require("../../controllers/ai.controller");

const AIRoute = express.Router();

AIRoute.post(
  "/ai_generate_questions",
  catchAsync(aiController.generateQuestions)
);
module.exports = AIRoute;
