const examProgressModel = require("../models/exam.progress.model");
const { studentModel } = require("../models/user.model");

class ExamProgressService {
  static createProgress = async (data, userId, roomId) => {
    console.log(data);
    const foundStudent = await studentModel.findById(userId);
    if (!foundStudent) throw new Error("");
    const updatedExamProgress = await examProgressModel.findOneAndUpdate(
      { userId }, // Điều kiện tìm kiếm
      { $set: data }, // Dữ liệu cần cập nhật
      { upsert: true, new: true } // Tạo mới nếu không có, trả về bản ghi mới sau khi cập nhật
    );
    return updatedExamProgress;
  };
  static getExamProgressByStudentId = async (userId) => {
    const foundExamProgress = await examProgressModel.find({
      userId,
    });
    return foundExamProgress;
  };

  static deleteExamProgressByStudentId = async (userId) => {
    const deletedExamProgress = await examProgressModel.findOneAndDelete({
      userId,
    });
    return deletedExamProgress;
  };
}
module.exports = ExamProgressService;
