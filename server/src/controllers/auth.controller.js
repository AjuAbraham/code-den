import { db } from "../db/index.js";
import bcrypt from "bcryptjs";
import ErrorHandler from "../utils/ErrorHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
import moment from "moment";
export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new ErrorHandler(400, "All fields are required");
    }
    const exsistingUser = await db.user.findUnique({
      where: {
        email,
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
    res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: error.success || false });
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ErrorHandler(400, "All fields are required");
    }
    const exsistingUser = await db.user.findUnique({
      where: { email },
    });
    if (!exsistingUser) {
      throw new ErrorHandler(401, "User doesn't exsist");
    }
    const isValidPassword = await bcrypt.compare(
      password,
      exsistingUser.password
    );
    if (!isValidPassword) {
      throw new ErrorHandler(401, "Invalid Credentials");
    }
    const generateToken = jwt.sign(
      { id: exsistingUser.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    const {
      password: pass,
      updatedAt,
      createdAt,
      ...restUserData
    } = exsistingUser;
    res.cookie("token", generateToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.status(201).json(
      new ApiResponse(201, "User logged in successfully", {
        ...restUserData,
      })
    );
  } catch (error) {
    console.log("error while login", error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: error.success || false });
  }
});

export const logoutUser = asyncHandler((req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, "User logged out successfully"));
  } catch (error) {
    console.log("error while logout", error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: error.success || false });
  }
});

export const checkUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const paramId = req.params?.id;
    const targetId = paramId ? paramId : userId;
    const userData = await db.user.findUnique({
      where: { id: targetId },
      include: {
        solvedProblems: {
          include: {
            problem: {
              select: {
                id: true,
                title: true,
                difficulty: true,
              },
            },
          },
        },
        DailyActivity: {
          orderBy: {
            date: "asc",
          },
        },
      },
    });

    const difficultyCount = {
      EASY: 0,
      MEDIUM: 0,
      HARD: 0,
    };

    const allSolved = userData?.solvedProblems || [];

    allSolved.forEach((entry) => {
      const difficulty = entry.problem.difficulty;
      if (difficultyCount[difficulty] !== undefined) {
        difficultyCount[difficulty]++;
      }
    });

    const recentlySolved = [...allSolved]
      .sort((a, b) => moment(b.createdAt).unix() - moment(a.createdAt).unix())
      .slice(0, 5)
      .map((entry) => ({
        problemId: entry.problem.id,
        title: entry.problem.title,
        difficulty: entry.problem.difficulty,
        solvedAt: moment(entry.createdAt).format("YYYY-MM-DD HH:mm:ss"),
      }));

    const problemCounts = await db.problem.groupBy({
      by: ["difficulty"],
      _count: {
        difficulty: true,
      },
    });

    const totalProblems = {
      EASY: 0,
      MEDIUM: 0,
      HARD: 0,
    };

    problemCounts.forEach((entry) => {
      totalProblems[entry.difficulty] = entry._count.difficulty;
    });

    res.status(200).json(
      new ApiResponse(200, "User authenticated successfully", {
        ...userData,
        difficultyCount,
        recentlySolved,
        totalProblems,
      })
    );
  } catch (error) {
    console.error("checkUser error", error);
    res.status(500).json(new ApiResponse(500, "Internal Server Error"));
  }
});
export const verifyUser = asyncHandler((req, res) => {
  try {
    const user = req.user;
    const { password, updatedAt, createdAt, ...restUserData } = user;
    res.status(200).json(
      new ApiResponse(200, "User authenticated successfully", {
        user: { ...restUserData },
      })
    );
  } catch (error) {
    console.log("register error");
  }
});
export const topContributers = asyncHandler(async (req, res) => {
  try {
    const users = await db.user.findMany({
      where: {
        streak: {
          gt: 0,
        },
      },
      orderBy: {
        streak: "desc",
      },
    });
    if (!users) {
      throw new ErrorHandler(404, "Unable to get top users");
    }
    res
      .status(200)
      .json(new ApiResponse(200, "User fetched successfully", users));
    return users;
  } catch (error) {
    console.log("register error");
  }
});
