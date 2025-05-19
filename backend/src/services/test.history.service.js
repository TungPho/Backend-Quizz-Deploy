const testHistoryModel = require("../models/test.history.model");

class TestHistoryService {
  static async getAllTestHistoryByTeacherId(teacherId) {
    const testsHistory = await testHistoryModel.find({ teacherId });
    return testsHistory;
  }

  static async getTestHistoryById(testHistoryId) {
    const testsHistory = await testHistoryModel.findById(testHistoryId);
    return testsHistory;
  }
  static async createTestHistory() {
    return {};
  }
}

module.exports = TestHistoryService;
