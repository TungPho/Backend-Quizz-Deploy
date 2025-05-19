const { Types } = require("mongoose");
const submissonModel = require("../models/submisson.model");
const testModel = require("../models/test.model");
const { userModel, studentModel } = require("../models/user.model");
class SubmissionService {
  static getAllSubmisionByUserId = async (userId) => {
    const foundUser = await studentModel.findById(new Types.ObjectId(userId));
    if (!foundUser) throw new Error("Can't find this user id");
    const submissions = await submissonModel.find({ userId: userId });
    return submissions;
  };

  static getSubmissionByRoomID = async (roomId) => {
    const submissions = await submissonModel.find({
      roomId,
    });
    return submissions;
  };

  static createSubmission = async ({
    testId,
    testName,
    userId,
    studentId,
    userName,
    answers,
    score,
    submitted_at = new Date(),
    number_of_correct_options,
    number_of_wrong_options,
    roomId,
  }) => {
    const foundTest = testModel.findById(testId);
    if (!foundTest) throw new Error("Can't find this test to add");
    const foundUser = userModel.findById(userId);
    if (!foundUser) throw new Error("Can't find this user");
    const foundSubmission = await submissonModel.findOne({
      roomId,
    });
    if (foundSubmission)
      throw new Error("Can't submit again, please ask for another test");

    const newSubmision = await submissonModel.create({
      testId,
      testName,
      userId,
      studentId,
      userName,
      answers,
      score,
      submitted_at,
      number_of_correct_options,
      number_of_wrong_options,
      roomId,
    });
    console.log(newSubmision);
    return newSubmision;
  };
}
module.exports = SubmissionService;
