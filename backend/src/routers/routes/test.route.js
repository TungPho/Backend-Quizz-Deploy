const express = require("express");
const catchAsync = require("../../handlers/asyncHandlers");
const testControllers = require("../../controllers/test.controllers");
const testRoute = express.Router();
testRoute.get("/tests", catchAsync(testControllers.getAllTests));
testRoute.get("/tests/:id", catchAsync(testControllers.findTestById));
testRoute.get(
  "/tests-find/:teacherId",
  catchAsync(testControllers.findAllTestByTeacherID)
);

testRoute.post("/tests", catchAsync(testControllers.createTest));
testRoute.put("/tests/:id", catchAsync(testControllers.updateTest));

testRoute.delete("/tests/:test_id", catchAsync(testControllers.deleteTest));

module.exports = testRoute;
