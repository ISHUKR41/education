"use strict";
/**
 * FILE: user.routes.ts
 * PURPOSE: User profile management — get, update, list users.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const initialize_1 = require("../database/initialize");
const auth_middleware_1 = require("../middleware/auth.middleware");
const error_middleware_1 = require("../middleware/error.middleware");
const router = (0, express_1.Router)();
router.get("/profile", auth_middleware_1.authenticate, (req, res, next) => {
    try {
        const user = initialize_1.dbHelper.get(`
      SELECT u.id, u.email, u.display_name, u.avatar_url, u.role, u.created_at,
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
router.patch("/profile", auth_middleware_1.authenticate, (req, res, next) => {
    try {
        const { displayName, avatarUrl, classId, stream, board, skillLevel } = req.body;
        if (displayName)
            initialize_1.dbHelper.run("UPDATE users SET display_name = ?, updated_at = datetime('now') WHERE id = ?", displayName, req.user.userId);
        if (avatarUrl)
            initialize_1.dbHelper.run("UPDATE users SET avatar_url = ?, updated_at = datetime('now') WHERE id = ?", avatarUrl, req.user.userId);
        if (classId)
            initialize_1.dbHelper.run("UPDATE student_profiles SET class_id = ?, updated_at = datetime('now') WHERE user_id = ?", classId, req.user.userId);
        if (stream)
            initialize_1.dbHelper.run("UPDATE student_profiles SET stream = ?, updated_at = datetime('now') WHERE user_id = ?", stream, req.user.userId);
        if (board)
            initialize_1.dbHelper.run("UPDATE student_profiles SET board = ?, updated_at = datetime('now') WHERE user_id = ?", board, req.user.userId);
        if (skillLevel)
            initialize_1.dbHelper.run("UPDATE student_profiles SET skill_level = ?, updated_at = datetime('now') WHERE user_id = ?", skillLevel, req.user.userId);
        initialize_1.dbHelper.save();
        res.json({ success: true, message: "Profile updated." });
    }
    catch (error) {
        next(error);
    }
});
router.get("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("admin", "super_admin"), (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const offset = (page - 1) * limit;
        const users = initialize_1.dbHelper.all("SELECT id, email, display_name, role, is_active, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?", limit, offset);
        const total = initialize_1.dbHelper.get("SELECT COUNT(*) as count FROM users");
        res.json({ success: true, data: { users, pagination: { page, limit, total: total?.count || 0 } } });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=user.routes.js.map