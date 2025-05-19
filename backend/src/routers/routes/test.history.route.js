const express = require("express");
const testHistoryController = require("../../controllers/test.history.controller");

const testHistoryRoute = express.Router();

testHistoryRoute.post("/test_history", testHistoryController.createTestHistory);
testHistoryRoute.get(
  "/test_history/:teacherId",
  testHistoryController.getAllTestHistoryByTeacherId
);

testHistoryRoute.get(
  "/get_test_history_by_id/:testHistoryId",
  testHistoryController.getTestHistoryById
);
module.exports = testHistoryRoute;
