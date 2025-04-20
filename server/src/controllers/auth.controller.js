import { db } from "../db/index.js";
import bcrypt from "bcryptjs";
import ErrorHandler from "../utils/errorHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";

export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new ErrorHandler(400, "All fields are required");
    }
    const exsistingUser = await db.user.findUnique({
      where: {
        email
      },
    });
    console.log(exsistingUser);
    if (exsistingUser) {
      throw new ErrorHandler(400, "User already exsist");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        role: UserRole.USER,
      },
    });
    if (!newUser) {
      throw new ErrorHandler(500, "Unable to create User");
    }
    const generateToken = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", generateToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.status(201).json(
      new ApiResponse(201, "User Created Successfully", {
        id: newUser.id,
        username: newUser.username,
        email: newUser.role,
        avatar: newUser.avatar,
      })
    );
  } catch (error) {
    console.log("error while registering", error);
    return res
      .status(error.statusCode)
      .json({ message: error.message, success: false });
  }
});
export const loginUser = asyncHandler((req, res) => {
  try {
    const { email, password } = req.body;
  } catch (error) {
    console.log("register error");
  }
});
export const logoutUser = asyncHandler((req, res) => {
  try {
  } catch (error) {
    console.log("register error");
  }
});
export const checkUser = asyncHandler((req, res) => {
  try {
    const user = req.user;
  } catch (error) {
    console.log("register error");
  }
});
