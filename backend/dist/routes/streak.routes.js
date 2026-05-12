"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * FILE: streak.routes.ts
 * PURPOSE: Streak management — daily check-in, streak history.
 */
const express_1 = require("express");
const uuid_1 = require("uuid");
const initialize_1 = require("../database/initialize");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authenticate, (req, res, next) => {
    try {
        const streaks = initialize_1.dbHelper.all("SELECT * FROM streaks WHERE user_id = ? ORDER BY date DESC LIMIT 30", req.user.userId);
        const profile = initialize_1.dbHelper.get("SELECT current_streak, longest_streak FROM student_profiles WHERE user_id = ?", req.user.userId);
        res.json({ success: true, data: { streaks, ...(profile || {}) } });
    }
    catch (error) {
        next(error);
    }
});
router.post("/checkin", auth_middleware_1.authenticate, (req, res, next) => {
    try {
        const today = new Date().toISOString().split("T")[0];
        const existing = initialize_1.dbHelper.get("SELECT id FROM streaks WHERE user_id = ? AND date = ?", req.user.userId, today);
        if (existing)
            return res.json({ success: true, message: "Already checked in today!", alreadyCheckedIn: true });
        initialize_1.dbHelper.run("INSERT INTO streaks (id, user_id, date, activity_type) VALUES (?, ?, ?, 'daily_checkin')", (0, uuid_1.v4)(), req.user.userId, today);
        initialize_1.dbHelper.run("UPDATE student_profiles SET current_streak = current_streak + 1, longest_streak = MAX(longest_streak, current_streak + 1), updated_at = datetime('now') WHERE user_id = ?", req.user.userId);
        initialize_1.dbHelper.save();
        res.json({ success: true, message: "Checked in! Streak maintained." });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=streak.routes.js.map