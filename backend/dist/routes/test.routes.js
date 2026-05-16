"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * FILE: test.routes.ts
 * PURPOSE: Test management — list, start, complete tests with scoring.
 */
const express_1 = require("express");
const uuid_1 = require("uuid");
const initialize_1 = require("../database/initialize");
const auth_middleware_1 = require("../middleware/auth.middleware");
const error_middleware_1 = require("../middleware/error.middleware");
const router = (0, express_1.Router)();
router.get("/", (_req, res, next) => {
    try {
        const tests = initialize_1.dbHelper.all("SELECT * FROM tests WHERE is_active = 1 ORDER BY created_at DESC LIMIT 50");
        res.json({ success: true, data: { tests } });
    }
    catch (error) {
        next(error);
    }
});
router.get("/:testId", (req, res, next) => {
    try {
        const test = initialize_1.dbHelper.get("SELECT * FROM tests WHERE id = ? AND is_active = 1", req.params.testId);
        if (!test)
            throw new error_middleware_1.AppError("Test not found.", 404, "TEST_NOT_FOUND");
        res.json({ success: true, data: { test } });
    }
    catch (error) {
        next(error);
    }
});
router.post("/:testId/start", auth_middleware_1.authenticate, (req, res, next) => {
    try {
        const test = initialize_1.dbHelper.get("SELECT * FROM tests WHERE id = ? AND is_active = 1", req.params.testId);
        if (!test)
            throw new error_middleware_1.AppError("Test not found.", 404, "TEST_NOT_FOUND");
        const attemptId = (0, uuid_1.v4)();
        initialize_1.dbHelper.run("INSERT INTO test_attempts (id, test_id, user_id, total_questions, status) VALUES (?, ?, ?, ?, 'in_progress')", attemptId, req.params.testId, req.user.userId, test.total_questions);
        initialize_1.dbHelper.save();
        res.status(201).json({ success: true, data: { attemptId } });
    }
    catch (error) {
        next(error);
    }
});
router.post("/:testId/complete", auth_middleware_1.authenticate, (req, res, next) => {
    try {
        const { attemptId, score, correctAnswers, wrongAnswers, skipped, timeTaken } = req.body;
        initialize_1.dbHelper.run("UPDATE test_attempts SET score = ?, correct_answers = ?, wrong_answers = ?, skipped = ?, time_taken_seconds = ?, status = 'completed', completed_at = datetime('now') WHERE id = ? AND user_id = ?", score, correctAnswers, wrongAnswers, skipped, timeTaken, attemptId, req.user.userId);
        const pts = Math.round((score || 0) * 0.5);
        if (pts > 0) {
            initialize_1.dbHelper.run("INSERT INTO points_transactions (id, user_id, amount, type, source, description) VALUES (?, ?, ?, 'earned', 'test', ?)", (0, uuid_1.v4)(), req.user.userId, pts, `Test completed`);
            initialize_1.dbHelper.run("UPDATE student_profiles SET total_points = total_points + ?, updated_at = datetime('now') WHERE user_id = ?", pts, req.user.userId);
        }
        initialize_1.dbHelper.save();
        res.json({ success: true, data: { pointsEarned: pts }, message: "Test completed!" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=test.routes.js.map