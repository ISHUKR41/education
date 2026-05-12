"use strict";
/**
 * FILE: auth.routes.ts
 * PURPOSE: Authentication — signup, signin, signout, refresh, profile.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const zod_1 = require("zod");
const initialize_1 = require("../database/initialize");
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const error_middleware_1 = require("../middleware/error.middleware");
const router = (0, express_1.Router)();
const signupSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email"),
    password: zod_1.z.string().min(8, "Password must be 8+ chars").regex(/[A-Z]/, "Need uppercase").regex(/[0-9]/, "Need number"),
    displayName: zod_1.z.string().min(2).max(50),
    role: zod_1.z.enum(["student", "parent", "teacher", "organizer"]).optional().default("student"),
});
const signinSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email"),
    password: zod_1.z.string().min(1, "Required"),
});
function generateTokens(userId, email, role) {
    const accessToken = jsonwebtoken_1.default.sign({ userId, email, role }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jsonwebtoken_1.default.sign({ userId, email, role }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken };
}
function setAuthCookies(res, at, rt) {
    res.cookie("access_token", at, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 900000 });
    res.cookie("refresh_token", rt, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 604800000 });
}
router.post("/signup", (0, validate_middleware_1.validate)(signupSchema, "body"), async (req, res, next) => {
    try {
        const { email, password, displayName, role } = req.body;
        const existing = initialize_1.dbHelper.get("SELECT id FROM users WHERE email = ?", email);
        if (existing)
            throw new error_middleware_1.AppError("Email already registered.", 409, "EMAIL_EXISTS");
        const hash = await bcryptjs_1.default.hash(password, 12);
        const userId = (0, uuid_1.v4)();
        initialize_1.dbHelper.run("INSERT INTO users (id, email, password_hash, display_name, role) VALUES (?, ?, ?, ?, ?)", userId, email, hash, displayName, role);
        if (role === "student") {
            initialize_1.dbHelper.run("INSERT INTO student_profiles (id, user_id) VALUES (?, ?)", (0, uuid_1.v4)(), userId);
        }
        const { accessToken, refreshToken } = generateTokens(userId, email, role);
        setAuthCookies(res, accessToken, refreshToken);
        initialize_1.dbHelper.save();
        res.status(201).json({ success: true, data: { user: { id: userId, email, displayName, role }, accessToken }, message: "Welcome to EduQuest!" });
    }
    catch (error) {
        next(error);
    }
});
router.post("/signin", (0, validate_middleware_1.validate)(signinSchema, "body"), async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = initialize_1.dbHelper.get("SELECT id, email, password_hash, display_name, role, is_active FROM users WHERE email = ?", email);
        if (!user)
            throw new error_middleware_1.AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
        if (!user.is_active)
            throw new error_middleware_1.AppError("Account deactivated.", 403, "ACCOUNT_DEACTIVATED");
        const valid = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!valid)
            throw new error_middleware_1.AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
        initialize_1.dbHelper.run("UPDATE users SET last_login_at = datetime('now') WHERE id = ?", user.id);
        const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);
        setAuthCookies(res, accessToken, refreshToken);
        initialize_1.dbHelper.save();
        res.json({ success: true, data: { user: { id: user.id, email: user.email, displayName: user.display_name, role: user.role }, accessToken } });
    }
    catch (error) {
        next(error);
    }
});
router.post("/signout", (_req, res) => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.json({ success: true, message: "Logged out." });
});
router.get("/me", auth_middleware_1.authenticate, (req, res, next) => {
    try {
        const user = initialize_1.dbHelper.get(`
      SELECT u.id, u.email, u.display_name, u.role, u.avatar_url, u.created_at,
             sp.class_id, sp.stream, sp.board, sp.total_points, sp.current_level,
             sp.current_streak, sp.longest_streak, sp.skill_level
      FROM users u LEFT JOIN student_profiles sp ON sp.user_id = u.id WHERE u.id = ?
    `, req.user.userId);
        if (!user)
            throw new error_middleware_1.AppError("User not found.", 404, "USER_NOT_FOUND");
        res.json({ success: true, data: { user } });
    }
    catch (error) {
        next(error);
    }
});
router.post("/refresh", (req, res, next) => {
    try {
        const rt = req.cookies?.refresh_token;
        if (!rt)
            throw new error_middleware_1.AppError("Refresh token missing.", 401, "NO_REFRESH_TOKEN");
        const decoded = jsonwebtoken_1.default.verify(rt, process.env.JWT_REFRESH_SECRET);
        const tokens = generateTokens(decoded.userId, decoded.email, decoded.role);
        setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
        res.json({ success: true, data: { accessToken: tokens.accessToken } });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map