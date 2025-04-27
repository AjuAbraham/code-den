import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import asyncHandler from "../utils/asyncHandler.js";
import { db } from "../db/index.js";
const authMiddleware = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new ErrorHandler(400, "token not passed!!");
    }
    const validToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!validToken) {
      throw new ErrorHandler(401, "Invalid Token!!");
    }
    const user = await db.user.findUnique({
      where: {
        id: validToken.id,
      },
    });
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(error.statusCode)
      .json({ message: error.message, success: false });
  }
});
const checkAdmin = (req, res, next) => {
  const { role } = req.user;
  if (!role && role !== "ADMIN") {
    return res.status(400).json({
      message: "Forbidden: You don't have permission to access this resoure",
    });
  }
  next();
};

export { authMiddleware, checkAdmin };
