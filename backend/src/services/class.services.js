const { Types } = require("mongoose");
const classModel = require("../models/class.model");
const {
  studentModel,
  userModel,
  teacherModel,
} = require("../models/user.model");

class ClassService {
  static getAllClasses = async () => {
    const results = await classModel.find();
    return results;
  };
  static createClass = async (inputClass) => {
    console.log(inputClass);
    const foundClass = await classModel.find({
      name: inputClass.name,
    });
    if (foundClass.length > 0) throw new Error("Class name already exist!");
    const newClass = await classModel.create(inputClass);
    return newClass;
  };
  static getClassById = async (id) => {
    const newClass = await classModel.findById(new Types.ObjectId(id));
    return newClass;
  };

  static getClassByTeacherId = async (teacherId) => {
    const foundUser = await teacherModel.findById(teacherId);
    if (!foundUser) throw new Error("Can't find this teacher's id");

    const classes = await classModel.find({
      teacherId: teacherId,
    });
    return classes;
  };

  static getAllClassesByStudentId = async (studentId) => {
    const foundStudent = await studentModel.findById(studentId);
    if (!foundStudent) throw new Error("Can't find this student's id");
    let classes = [];
    for (let c of foundStudent.classes) {
      const resClass = await classModel.findById(c);
      classes.push(resClass);
    }
    return classes;
  };
  static updateClassById = async (classId, className) => {
    if (!className) {
      throw new Error("className không được để trống");
    }

    const updatedClass = await classModel.findByIdAndUpdate(
      classId,
      { name: className },
      { new: true, runValidators: true } // Trả về bản ghi mới sau cập nhật, chạy validators
    );

    if (!updatedClass) {
      throw new Error("Không tìm thấy lớp học với ID đã cho");
    }
    return updatedClass;
  };

  // delete class
  static deleteClass = async (classId) => {
    const deletedClass = await classModel.findByIdAndDelete(classId);
    return deletedClass;
  };
  static addStudentToClassById = async (id, studentID) => {
    // 1.
    //class id
    const foundClass = await classModel.findById(new Types.ObjectId(id));
    const student = await studentModel.findOne({
      student_id: studentID,
    });
    if (!student) throw new Error("Can't find this student");

    // find if this student already in the class
    const isStudentInTheClass = await studentModel.find({ classes: id });
    if (isStudentInTheClass >= 1)
      throw new Error("This Student already in the class");
    // 1. tìm class và add student đó vào:
    foundClass.students.push(student._id);
    foundClass.save();
    // 2. Tìm student và add class id vào
    student.classes.push(foundClass._id);
    student.save();
    return foundClass;
  };
  static removeStudentFromClass = async (id, studentID) => {
    // 1.
    //class id
    const foundClass = await classModel.findById(new Types.ObjectId(id));
    const student = await studentModel.findById(studentID);
    if (!student) throw new Error("Can't find this student");
    if (!foundClass) throw new Error("Can't find this class");
    foundClass.students = foundClass.students.filter(
      (sId) => sId.toString() !== student._id.toString()
    );

    await foundClass.save();

    return foundClass;
  };
}
module.exports = ClassService;
