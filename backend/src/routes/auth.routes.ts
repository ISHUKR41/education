/**
 * FILE: auth.routes.ts
 * PURPOSE: Authentication — signup, signin, signout, refresh, profile.
 */

import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import prisma from "../database/prisma";
import { validate } from "../middleware/validate.middleware";
import { authenticate } from "../middleware/auth.middleware";
import { AppError } from "../middleware/error.middleware";

const router = Router();

const signupSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be 8+ chars").regex(/[A-Z]/, "Need uppercase").regex(/[0-9]/, "Need number"),
  displayName: z.string().min(2).max(50),
  role: z.enum(["student", "parent", "teacher", "organizer"]).optional().default("student"),
});

const signinSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Required"),
});

const roleBySignupInput = {
  student: "STUDENT",
  parent: "PARENT",
  teacher: "TEACHER",
  organizer: "ORGANIZER",
} as const;

function toApiUser(user: {
  id: string;
  email: string;
  name: string | null;
  role: string;
  studentProfile?: unknown;
}) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.name,
    role: user.role,
    studentProfile: user.studentProfile,
  };
}

function generateTokens(userId: string, email: string, role: string) {
  const accessToken = jwt.sign({ userId, email, role }, process.env.JWT_SECRET!, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId, email, role }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
  return { accessToken, refreshToken };
}

function setAuthCookies(res: Response, at: string, rt: string) {
  res.cookie("access_token", at, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 900000 });
  res.cookie("refresh_token", rt, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 604800000 });
}

router.post("/signup", validate(signupSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, displayName, role } = req.body;
    const normalizedRole = roleBySignupInput[role as keyof typeof roleBySignupInput];
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new AppError("Email already registered.", 409, "EMAIL_EXISTS");

    // Hash password and create user
    const hash = await bcrypt.hash(password, 12);
    const userId = uuidv4();
    const user = await prisma.user.create({
      data: {
        id: userId,
        email,
        passwordHash: hash,
        name: displayName,
        role: normalizedRole,
      }
    });

    // Student profiles keep learning metadata separate from account credentials.
    if (role === "student") {
      await prisma.studentProfile.create({
        data: {
          id: uuidv4(),
          userId,
        }
      });
    }

    const { accessToken, refreshToken } = generateTokens(userId, email, normalizedRole);
    setAuthCookies(res, accessToken, refreshToken);

    res.status(201).json({ success: true, data: { user: toApiUser(user), accessToken }, message: "Welcome to EduQuest!" });
  } catch (error) { next(error); }
});

router.post("/signin", validate(signinSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
    if (!user.isActive) throw new AppError("Account deactivated.", 403, "ACCOUNT_DEACTIVATED");
    if (!user.passwordHash) throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");

    // Verify password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");

    // Update last login time
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() }
    });

    const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);
    setAuthCookies(res, accessToken, refreshToken);

    res.json({ success: true, data: { user: toApiUser(user), accessToken } });
  } catch (error) { next(error); }
});

router.post("/signout", (_req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.json({ success: true, message: "Logged out." });
});

router.get("/me", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: req.user!.userId },
      include: {
        studentProfile: true
      }
    });
    if (!user) throw new AppError("User not found.", 404, "USER_NOT_FOUND");
    res.json({ success: true, data: { user: toApiUser(user) } });
  } catch (error) { next(error); }
});

router.post("/refresh", (req: Request, res: Response, next: NextFunction) => {
  try {
    const rt = req.cookies?.refresh_token;
    if (!rt) throw new AppError("Refresh token missing.", 401, "NO_REFRESH_TOKEN");
    const decoded = jwt.verify(rt, process.env.JWT_REFRESH_SECRET!) as { userId: string; email: string; role: string };
    const tokens = generateTokens(decoded.userId, decoded.email, decoded.role);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    res.json({ success: true, data: { accessToken: tokens.accessToken } });
  } catch (error) { next(error); }
});

export default router;
