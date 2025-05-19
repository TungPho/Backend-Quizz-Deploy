const express = require("express");
const userControllers = require("../../controllers/user.controllers");
const catchAsync = require("../../handlers/asyncHandlers");
const authAdmin = require("../../auth/authAdmin");
const userRoute = express.Router();
userRoute.get("/users", catchAsync(authAdmin), userControllers.getAllUsers);
userRoute.get("/users/:userId", catchAsync(userControllers.getUserById));
userRoute.delete(
  "/users/:userId",
  catchAsync(authAdmin),
  catchAsync(userControllers.deleteUserById)
);

userRoute.get(
  "/students",
  catchAsync(authAdmin),
  userControllers.getAllStudents
);
userRoute.get(
  "/teachers",
  catchAsync(authAdmin),
  userControllers.getAllTeachers
);

userRoute.get(
  "/teachers_request",
  catchAsync(authAdmin),
  userControllers.getTeacherPendingRequests
);

userRoute.post(
  "/teachers_request/:teacherId",
  catchAsync(authAdmin),
  userControllers.approveTeacherRequest
);

userRoute.put("/users/:userId", catchAsync(userControllers.updateUserById));

//login admin
userRoute.post("/admin/login", catchAsync(userControllers.loginAdmin));

userRoute.post("/users", catchAsync(userControllers.registerUser));
userRoute.post("/login", catchAsync(userControllers.loginUser));
//reset password:
userRoute.post("/users/verify", catchAsync(userControllers.verifyUser));
userRoute.post(
  "/users/request-password-reset",
  catchAsync(userControllers.requestPasswordReset)
);
userRoute.post(
  "/users/reset-password/:id/:token",
  catchAsync(userControllers.resetPassword)
);
module.exports = userRoute;
