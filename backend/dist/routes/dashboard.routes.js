"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * FILE: dashboard.routes.ts
 * PURPOSE: Dashboard data aggregation.
 */
const express_1 = require("express");
const initialize_1 = require("../database/initialize");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authenticate, (req, res, next) => {
    try {
        const profile = initialize_1.dbHelper.get(`
      SELECT u.display_name, u.email, u.avatar_url, u.role,
             sp.total_points, sp.current_level, sp.current_streak,
             sp.longest_streak, sp.class_id, sp.stream, sp.skill_level
      FROM users u LEFT JOIN student_profiles sp ON sp.user_id = u.id WHERE u.id = ?
    `, req.user.userId);
        const recentActivity = initialize_1.dbHelper.all("SELECT * FROM points_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 10", req.user.userId);
        const badges = initialize_1.dbHelper.all("SELECT b.* FROM badges b INNER JOIN user_badges ub ON ub.badge_id = b.id WHERE ub.user_id = ? ORDER BY ub.earned_at DESC", req.user.userId);
        const recentTests = initialize_1.dbHelper.all("SELECT ta.*, t.title as test_title FROM test_attempts ta INNER JOIN tests t ON t.id = ta.test_id WHERE ta.user_id = ? ORDER BY ta.created_at DESC LIMIT 5", req.user.userId);
        const streakHistory = initialize_1.dbHelper.all("SELECT date, points_earned FROM streaks WHERE user_id = ? AND date >= date('now', '-30 days') ORDER BY date DESC", req.user.userId);
        res.json({ success: true, data: { profile, recentActivity, badges, recentTests, streakHistory } });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map