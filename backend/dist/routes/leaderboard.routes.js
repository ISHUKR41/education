"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * FILE: leaderboard.routes.ts
 * PURPOSE: Leaderboard — global and class rankings.
 */
const express_1 = require("express");
const initialize_1 = require("../database/initialize");
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => {
    try {
        const { classId } = req.query;
        const limit = Math.min(parseInt(req.query.limit) || 50, 100);
        let sql = "SELECT u.id, u.display_name, u.avatar_url, sp.total_points, sp.current_level, sp.current_streak, sp.class_id FROM student_profiles sp INNER JOIN users u ON u.id = sp.user_id WHERE u.is_active = 1";
        const params = [];
        if (classId) {
            sql += " AND sp.class_id = ?";
            params.push(classId);
        }
        sql += " ORDER BY sp.total_points DESC LIMIT ?";
        params.push(limit);
        const rankings = initialize_1.dbHelper.all(sql, ...params);
        res.json({ success: true, data: { rankings } });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=leaderboard.routes.js.map