const { userModel } = require("../models/user.model");
const TestService = require("../services/test.service");

class TestController {
  getAllTests = async (req, res, next) => {
    const results = await TestService.getAllTests();
    return res.status(200).json({
      message: "Get all tests success",
      metadata: results,
    });
  };
  findTestById = async (req, res, next) => {
    const { id } = req.params;
    const foundTest = await TestService.findTestById(id);
    if (!foundTest) throw new Error("Can't find this test ID");
    return res.status(200).json({
      message: "Get test by ID success",
      metadata: foundTest,
    });
  };

  findAllTestByTeacherID = async (req, res, next) => {
    const { teacherId } = req.params;
    console.log(teacherId);
    const foundTeacher = await userModel.findById(teacherId);
    if (!foundTeacher) throw new Error("Can't find this teacherId ");
    const tests = await TestService.findTestsByTeacherID(teacherId);
    return res.status(200).json({
      message: "Get all test by teacherID success",
      metadata: tests,
    });
  };
  createTest = async (req, res, next) => {
    const { title, classId, teacherId, timeLimit } = req.body;
    const test = { title, classId, teacherId, timeLimit };
    const results = await TestService.createTest(test);
    return res.status(200).json({
      message: "Create a tests success",
      metadata: results,
    });
  };

  updateTest = async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    const { title, timeLimit, classId, teacherId } = req.body;
    console.log(title, timeLimit);
    const results = await TestService.updateTest(
      { title, timeLimit, classId, teacherId },
      id
    );
    return res.status(200).json({
      message: "Update a tests success",
      metadata: results,
    });
  };
  deleteTest = async (req, res, next) => {
    const { test_id } = req.params;
    const results = await TestService.deleteTest(test_id);
    return res.status(200).json({
      message: "Delete a tests success",
      metadata: results,
    });
  };
}
module.exports = new TestController();
