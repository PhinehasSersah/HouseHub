const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authenticateUser =  async (req, res, next) => {
//  console.log(req.body)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.fullName };
    next();
  } catch (error) { 
    throw new UnauthenticatedError("Authentication failed");
  }
};

module.exports = authenticateUser;
