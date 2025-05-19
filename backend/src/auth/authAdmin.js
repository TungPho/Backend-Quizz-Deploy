const { userModel } = require("../models/user.model");

const authAdmin = async (req, res, next) => {
  const { email } = req.headers;
  const foundUser = await userModel.findOne({ email });
  console.log(foundUser);
  if (foundUser.role !== "admin") throw new Error("Not Authorized");
  next();
};
module.exports = authAdmin;
