const { Types } = require("mongoose");
const testModel = require("../models/test.model");
const QuestionService = require("../services/question.services");
const questionModel = require("../models/question.model");

class QuestionController {
  // admin functions
  getAllQuestions = async (req, res, next) => {
    const results = await QuestionService.getAllQuestions();
    return res.status(200).json({
      message: "Get all questions success",
      metadata: results,
    });
  };
  findQuestionById = async (req, res, next) => {
    const { id } = req.params;
    const foundTest = await QuestionService.findQuestionById(id);
    if (!foundTest) throw new Error("Can't find this question ID");
    return res.status(200).json({
      message: "Get test by ID success",
      metadata: foundTest,
    });
  };
  // also add questions to test id // require: testId
  createQuestion = async (req, res, next) => {
    const { quizId, text, options } = req.body;
    const quest = { quizId, text, options };
    const test = await testModel.findById(new Types.ObjectId(quizId));
    // create a new question
    if (!test) throw new Error("Can't find the id of the test");
    const result = await QuestionService.createQuestion(quest);
    if (!result) throw new Error("Error in creating question");
    // add new question to the test (quizId)
    test.questions.push(result.newQuestion._id);
    test.save();
    return res.status(200).json({
      message: "Create a question success",
      metadata: result,
    });
  };

  generateQuestionsAI = async (req, res, next) => {
    try {
      const { questions, teacherId, title } = req.body;

      // Create the test first
      const newTest = await testModel.create({
        teacherId,
        title,
      });

      if (!newTest) throw new Error("Error creating test");
      console.log(newTest._id);

      // Use Promise.all to wait for all question creations to complete
      const questionsPromises = questions.map(async (q) => {
        q.quizId = newTest._id;
        const newQuestion = await questionModel.create(q);
        console.log("ID", newQuestion._id);
        return newQuestion._id; // Return the ID from each promise
      });

      // Wait for all questions to be created and get their IDs
      const questionsID = await Promise.all(questionsPromises);

      console.log(questions);
      console.log(questionsID);

      // Save the question IDs to the test
      newTest.questions = questionsID;
      await newTest.save();

      return res.status(200).json({
        message: "Generate questions successfully!",
        metadata: newTest,
      });
    } catch (error) {
      next(error);
    }
  };

  updateQuestion = async (req, res, next) => {
    const { id } = req.params;
    const { text, options } = req.body;
    const result = await QuestionService.updateQuestionById(
      { text, options },
      id
    );
    return res.status(200).json({
      message: "Update a question success",
      metadata: result,
    });
  };
  // if you remove questions, you also have to remove in the array, provide the id
  removeQuestionById = async (req, res, next) => {
    const { id } = req.params;
    const result = await QuestionService.removeQuestionById(id);

    // also have to remove it in the tests
    return res.status(200).json({
      message: "Delete a question success",
      metadata: result,
    });
  };
}
module.exports = new QuestionController();
