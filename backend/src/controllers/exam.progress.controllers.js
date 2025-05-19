const ExamProgressService = require("../services/exam.progress.services");
class ExamProgressController {
  createProgress = async (req, res, next) => {
    const { userId } = req.params;
    const {
      studentId,
      roomId,
      examId,
      examName,
      startTime,
      endTime,
      remainingTime,
      answers,
      status,
    } = req.body;
    const data = {
      studentId,
      roomId,
      examId,
      examName,
      startTime,
      endTime,
      remainingTime,
      answers,
      status,
    };
    console.log(req.body);
    const result = await ExamProgressService.createProgress(
      data,
      userId,
      roomId
    );
    return res.status(200).json({
      message: "create and update exam progress success",
      metadata: result,
    });
  };
  getExamProgressByStudentId = async (req, res, next) => {
    const { userId } = req.params;
    const result = await ExamProgressService.getExamProgressByStudentId(userId);
    return res.status(200).json({
      message: "get student exam's progress success",
      metadata: result,
    });
  };
  // when submit exam
  deleteExamProgressByStudentId = async (req, res, next) => {
    const { userId } = req.params;
    const result = await ExamProgressService.deleteExamProgressByStudentId(
      userId
    );
    return res.status(200).json({
      message: "delete student exam's progress success",
      metadata: result,
    });
  };
}
module.exports = new ExamProgressController();
