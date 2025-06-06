const {
  userModel,
  teacherModel,
  studentModel,
} = require("../models/user.model");

class UserServiceFactory {
  static userRegistry = {};
  static getAllUser = async () => {
    const users = await userModel.find();
    return users;
  };

  static getUserById = async (userId) => {
    const users = await userModel.findById(userId);
    return users;
  };

  static updateUserById = async (userId, name, school_name) => {
    const foundUser = await userModel.findById(userId);
    if (!foundUser) throw new Error("Can't find this user");
    const role = foundUser.role;
    const users = await userModel.findByIdAndUpdate(userId, {
      user_attributes: {
        name,
        school_name,
      },
    });
    const newUser =
      role === "student"
        ? await studentModel.findByIdAndUpdate(userId, {
            name,
            school_name,
          })
        : await teacherModel.findByIdAndUpdate(userId, {
            name,
            school_name,
          });

    console.log(newUser);
    return users;
  };
  static deleteUserById = async (userId) => {
    const foundStudent = await userModel.findById(userId);
    if (!foundStudent) throw new Error("Can't find user's id");
    const students = await userModel.findByIdAndDelete(userId);
    const deleted =
      foundStudent.role === "student"
        ? await studentModel.findByIdAndDelete(userId)
        : await teacherModel.findByIdAndDelete(userId);
    return students;
  };
  // activate and deactivate
  static deactivateUserById = async (userId) => {
    const foundUser = userModel.findByIdAndUpdate(userId, {
      is_active: false,
    });
    return foundUser;
  };

  static activateUserById = async (userId) => {
    const foundUser = userModel.findByIdAndUpdate(userId, {
      is_active: true,
    });
    return foundUser;
  };
  static getAllStudents = async () => {
    const students = await userModel.find({ role: "student" });
    return students;
  };

  static getAllTeachers = async () => {
    const teachers = await userModel.find({ role: "teacher" });
    return teachers;
  };

  static getAllTeachersRequests = async () => {
    const teachers = await userModel.find({
      role: "teacher",
      is_active: false,
    });
    return teachers;
  };
  static approveTeacherRequest = async (teacherId) => {
    const foundTeacher = userModel.findByIdAndUpdate(teacherId, {
      is_active: true,
    });

    return foundTeacher;
  };

  static rejectTeacherRequest = async (teacherId) => {
    const foundTeacher = userModel.findByIdAndUpdate(teacherId, {
      is_active: null,
    });

    return foundTeacher;
  };
  static registerUserRole = (role, classRef) => {
    this.userRegistry[role] = classRef;
  };
  static async createUser({ role, payload }) {
    // lấy user class tại đây
    const userClass = this.userRegistry[role];
    if (!userClass) throw new Error(`Invalid Type ${role}`);

    return new userClass(payload).createUser();
  }
}
// tạo class con (teacher, student) trước rồi tạo user chính
class User {
  constructor({ email, password, role, classes, user_attributes }) {
    this.email = email;
    this.password = password;
    this.role = role;
    this.classes = classes;
    this.user_attributes = user_attributes;
  }
  async createUser(userID) {
    console.log("3");
    const newUser = await userModel.create({ ...this, _id: userID });
    return newUser;
  }
  updateUser = async (userID) => {};
}

class Teacher extends User {
  createUser = async () => {
    const newTeacher = await teacherModel.create({ ...this.user_attributes });
    if (!newTeacher) throw new Error("Error create teacher");
    const newUser = await super.createUser(newTeacher._id);
    if (!newUser) throw new Error("Error create user");
    return newUser;
  };
}

class Student extends User {
  createUser = async () => {
    const newStudent = await studentModel.create({ ...this.user_attributes });
    if (!newStudent) throw new Error("Error create student");
    const newUser = await super.createUser(newStudent._id);

    if (!newStudent) throw new Error("Error create user");
    return newStudent;
  };
}
UserServiceFactory.registerUserRole("teacher", Teacher);
UserServiceFactory.registerUserRole("student", Student);

module.exports = UserServiceFactory;
