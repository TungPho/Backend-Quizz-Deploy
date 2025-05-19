const { Types } = require("mongoose");
const questionModel = require("../models/question.model");
const testModel = require("../models/test.model");

class QuestionService {
  static getAllQuestions = async () => {
    const questions = await questionModel.find();
    return questions;
  };
  static findQuestionById = async (testId) => {
    const foundTest = await questionModel.findById(new Types.ObjectId(testId));
    return foundTest;
  };
  // also add questions to test
  static createQuestion = async (question) => {
    const newQuestion = await questionModel.create(question);
    return { newQuestion };
  };

  static updateQuestionById = async (data, id) => {
    const updatedQuestion = await questionModel.updateOne(
      { _id: new Types.ObjectId(id) },
      data
    );
    return { updatedQuestion };
  };

  static removeQuestionById = async (id) => {
    const foundQuestion = await questionModel.findById(new Types.ObjectId(id));
    if (!foundQuestion) throw new Error("Can't find that question id");

    // remove the question in all the test that its belong to
    const updatedTest = await testModel.updateMany(
      {},
      {
        $pull: {
          questions: new Types.ObjectId(id),
        },
      }
    );
    // delete the question
    const deletedQuestion = await questionModel.findByIdAndDelete(
      new Types.ObjectId(id)
    );

    return { deletedQuestion, updatedTest };
  };
}
module.exports = QuestionService;
