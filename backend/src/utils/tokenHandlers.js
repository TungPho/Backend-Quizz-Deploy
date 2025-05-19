const jwt = require("jsonwebtoken");
const generateToken = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET);
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET);

  return accessToken;
};

const verifyToken = (payload, token) => {
  const { email } = jwt.verify(token, process.env.JWT_SECRET);
  console.log(email === payload.email);
  if (payload.email !== email) return false;
  return true;
};
module.exports = { generateToken, verifyToken };
