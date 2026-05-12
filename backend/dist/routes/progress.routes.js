"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * FILE: progress.routes.ts
 * PURPOSE: Student learning progress tracking.
 */
const express_1 = require("express");
const uuid_1 = require("uuid");
const initialize_1 = require("../database/initialize");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authenticate, (req, res, next) => {
    try {
        const progress = initialize_1.dbHelper.all("SELECT * FROM progress WHERE user_id = ? ORDER BY updated_at DESC", req.user.userId);
        res.json({ success: true, data: { progress } });
    }
    catch (error) {
        next(error);
    }
});
router.post("/", auth_middleware_1.authenticate, (req, res, next) => {
    try {
        const { topicId, status, percentComplete, timeSpentSeconds } = req.body;
        const existing = initialize_1.dbHelper.get("SELECT id FROM progress WHERE user_id = ? AND topic_id = ?", req.user.userId, topicId);
        if (existing) {
            initialize_1.dbHelper.run("UPDATE progress SET status = ?, percent_complete = ?, time_spent_seconds = time_spent_seconds + ?, updated_at = datetime('now') WHERE id = ?", status, percentComplete, timeSpentSeconds || 0, existing.id);
        }
        else {
            initialize_1.dbHelper.run("INSERT INTO progress (id, user_id, topic_id, status, percent_complete, time_spent_seconds) VALUES (?, ?, ?, ?, ?, ?)", (0, uuid_1.v4)(), req.user.userId, topicId, status, percentComplete, timeSpentSeconds || 0);
        }
        initialize_1.dbHelper.save();
        res.json({ success: true, message: "Progress updated." });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=progress.routes.js.map