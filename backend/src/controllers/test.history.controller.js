const submissonModel = require("../models/submisson.model");
const testHistoryModel = require("../models/test.history.model");
const TestHistoryService = require("../services/test.history.service");
const calScore = require("../utils/calScore");

class TestHistoryController {
  getAllTestHistoryByTeacherId = async (req, res, next) => {
    const { teacherId } = req.params;
    const results = await TestHistoryService.getAllTestHistoryByTeacherId(
      teacherId
    );
    return res.status(200).json({
      message: "get all Test History Successful",
      metadata: results,
    });
  };

  getTestHistoryById = async (req, res, next) => {
    const { testHistoryId } = req.params;
    const result = await TestHistoryService.getTestHistoryById(testHistoryId);
    return res.status(200).json({
      message: "Get TestHistory By Id successful",
      metadata: result,
    });
  };

  createTestHistory = async (req, res, next) => {
    const {
      testName,
      className,
      classId,
      roomId,
      teacherId,
      startTime,
      endTime,
    } = req.body;
    // find submissions by roomID
    const foundSubmissions = await submissonModel.find({
      roomId,
    });
    const scores = foundSubmissions.map((sub, index) => {
      return {
        userId: sub.userId,
        score: sub.score,
      };
    });
    const { highestScore, lowestScore, averageScore } = calScore(scores);
    const newTestHistory = {
      testName,
      className,
      classId,
      roomId,
      teacherId,
      startTime,
      endTime,
      scores,
      highestScore,
      lowestScore,
      averageScore,
      numberOfSubmissions: scores.length,
    };
    const createdTestHistory = await testHistoryModel.create(newTestHistory);
    return res.status(200).json({
      message: "Create Test History Successful",
      metadata: createdTestHistory,
    });
  };
}
module.exports = new TestHistoryController();
