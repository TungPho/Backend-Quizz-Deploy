const express = require("express");
const catchAsync = require("../../handlers/asyncHandlers");
const classControllers = require("../../controllers/class.controllers");
const classRoute = express.Router();
classRoute.get("/classes", catchAsync(classControllers.getAllClasses));
classRoute.get("/classes/:id", catchAsync(classControllers.getClassById));
classRoute.get(
  "/teacher_get_classes/:teacher_id",
  catchAsync(classControllers.getClassByTeacherId)
);
classRoute.get(
  "/student_get_classes/:student_id",
  catchAsync(classControllers.getAllClassesByStudentId)
);
classRoute.get(
  "/get_all_students/:classId",
  catchAsync(classControllers.getAllStudentsByClassId)
);

classRoute.post("/classes/:id", catchAsync(classControllers.addStudentToClass));
classRoute.post("/classes", catchAsync(classControllers.createClass));
classRoute.put("/classes/:id", catchAsync(classControllers.updateClass));
classRoute.delete("/classes/:id", catchAsync(classControllers.deleteClass));
module.exports = classRoute;
