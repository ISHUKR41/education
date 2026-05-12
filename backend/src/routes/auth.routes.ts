/**
 * FILE: auth.routes.ts
 * PURPOSE: Authentication — signup, signin, signout, refresh, profile.
 */

import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { dbHelper } from "../database/initialize";
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
    const existing = dbHelper.get("SELECT id FROM users WHERE email = ?", email);
    if (existing) throw new AppError("Email already registered.", 409, "EMAIL_EXISTS");

    const hash = await bcrypt.hash(password, 12);
    const userId = uuidv4();
    dbHelper.run("INSERT INTO users (id, email, password_hash, display_name, role) VALUES (?, ?, ?, ?, ?)", userId, email, hash, displayName, role);

    if (role === "student") {
      dbHelper.run("INSERT INTO student_profiles (id, user_id) VALUES (?, ?)", uuidv4(), userId);
    }

    const { accessToken, refreshToken } = generateTokens(userId, email, role);
    setAuthCookies(res, accessToken, refreshToken);
    dbHelper.save();

    res.status(201).json({ success: true, data: { user: { id: userId, email, displayName, role }, accessToken }, message: "Welcome to EduQuest!" });
  } catch (error) { next(error); }
});

router.post("/signin", validate(signinSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = dbHelper.get("SELECT id, email, password_hash, display_name, role, is_active FROM users WHERE email = ?", email);
    if (!user) throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
    if (!user.is_active) throw new AppError("Account deactivated.", 403, "ACCOUNT_DEACTIVATED");

    const valid = await bcrypt.compare(password, user.password_hash as string);
    if (!valid) throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");

    dbHelper.run("UPDATE users SET last_login_at = datetime('now') WHERE id = ?", user.id);
    const { accessToken, refreshToken } = generateTokens(user.id as string, user.email as string, user.role as string);
    setAuthCookies(res, accessToken, refreshToken);
    dbHelper.save();

    res.json({ success: true, data: { user: { id: user.id, email: user.email, displayName: user.display_name, role: user.role }, accessToken } });
  } catch (error) { next(error); }
});

router.post("/signout", (_req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.json({ success: true, message: "Logged out." });
});

router.get("/me", authenticate, (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = dbHelper.get(`
      SELECT u.id, u.email, u.display_name, u.role, u.avatar_url, u.created_at,
             sp.class_id, sp.stream, sp.board, sp.total_points, sp.current_level,
             sp.current_streak, sp.longest_streak, sp.skill_level
      FROM users u LEFT JOIN student_profiles sp ON sp.user_id = u.id WHERE u.id = ?
    `, req.user!.userId);
    if (!user) throw new AppError("User not found.", 404, "USER_NOT_FOUND");
    res.json({ success: true, data: { user } });
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
