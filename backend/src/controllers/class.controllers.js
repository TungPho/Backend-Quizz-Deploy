const classModel = require("../models/class.model");
const { studentModel } = require("../models/user.model");
const ClassService = require("../services/class.services");

class ClassController {
  // admin's function
  getAllClasses = async (req, res, next) => {
    const results = await ClassService.getAllClasses();
    res.status(200).json({
      messaege: "Get all classes success",
      metadata: results,
    });
  };
  // get class by the id of the class
  getClassById = async (req, res, next) => {
    const { id } = req.params;
    const results = await ClassService.getClassById(id);
    res.status(200).json({
      messaege: "Get class success",
      metadata: results,
    });
  };

  getAllClassesByStudentId = async (req, res, next) => {
    const { student_id } = req.params;
    const classes = await ClassService.getAllClassesByStudentId(student_id);
    res.status(200).json({
      messaege: "Get class success",
      metadata: classes,
    });
  };

  getAllStudentsByClassId = async (req, res, next) => {
    const { classId } = req.params;
    const foundStudents = await studentModel.find({ classes: classId });
    res.status(200).json({
      messaege: "Get all students by class id success",
      metadata: foundStudents,
    });
    v;
  };

  // get class by teacherId
  getClassByTeacherId = async (req, res, next) => {
    const { teacher_id } = req.params;
    const results = await ClassService.getClassByTeacherId(teacher_id);
    res.status(200).json({
      messaege: "Get class for teacher success",
      metadata: results,
    });
  };

  // phải check student đã trong class chưa, nếu rồi thì không cần add
  addStudentToClass = async (req, res, next) => {
    //class id
    const { id } = req.params;
    const { studentID } = req.body;
    const result = await ClassService.addStudentToClassById(id, studentID);
    res.status(200).json({
      messaege: "Add Student to the class success",
      metadata: result,
    });
  };

  createClass = async (req, res, next) => {
    const { name, teacherId, students, tests } = req.body;
    const newClass = { name, teacherId, students, tests };
    const result = await ClassService.createClass(newClass);
    res.status(200).json({
      messaege: "Create a new class success",
      metadata: result,
    });
  };
  updateClass = async (req, res, next) => {
    // implement update
    const { id } = req.params;
    const { class_name } = req.body;
    const updatedClass = await ClassService.updateClassById(id, class_name);
    res.status(200).json({
      messaege: "Update class success",
      metadata: { updatedClass },
    });
  };
  deleteClass = async (req, res, next) => {
    const { id } = req.params;
    const deletedClass = await ClassService.deleteClass(id);
    res.status(200).json({
      messaege: "Delete a  class success",
      metadata: { deletedClass },
    });
  };
}
module.exports = new ClassController();
