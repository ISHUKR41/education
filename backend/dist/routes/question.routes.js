"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * FILE: question.routes.ts
 * PURPOSE: Question endpoints — list, submit answers with scoring.
 */
const express_1 = require("express");
const uuid_1 = require("uuid");
const initialize_1 = require("../database/initialize");
const auth_middleware_1 = require("../middleware/auth.middleware");
const error_middleware_1 = require("../middleware/error.middleware");
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => {
    try {
        const { topicId, difficulty } = req.query;
        let sql = "SELECT id, topic_id, type, question_text, options, difficulty, points, time_limit_seconds FROM questions WHERE is_active = 1";
        const params = [];
        if (topicId) {
            sql += " AND topic_id = ?";
            params.push(topicId);
        }
        if (difficulty) {
            sql += " AND difficulty = ?";
            params.push(difficulty);
        }
        sql += " ORDER BY sort_order ASC LIMIT 50";
        const questions = initialize_1.dbHelper.all(sql, ...params);
        res.json({ success: true, data: { questions } });
    }
    catch (error) {
        next(error);
    }
});
router.post("/:questionId/submit", auth_middleware_1.authenticate, (req, res, next) => {
    try {
        const { answer } = req.body;
        const q = initialize_1.dbHelper.get("SELECT * FROM questions WHERE id = ?", req.params.questionId);
        if (!q)
            throw new error_middleware_1.AppError("Question not found.", 404, "QUESTION_NOT_FOUND");
        const isCorrect = String(answer).trim().toLowerCase() === String(q.correct_answer).trim().toLowerCase();
        const pointsEarned = isCorrect ? q.points : 0;
        if (isCorrect) {
            initialize_1.dbHelper.run("INSERT INTO points_transactions (id, user_id, amount, type, source, description) VALUES (?, ?, ?, 'earned', 'question', ?)", (0, uuid_1.v4)(), req.user.userId, pointsEarned, `Correct answer`);
            initialize_1.dbHelper.run("UPDATE student_profiles SET total_points = total_points + ?, updated_at = datetime('now') WHERE user_id = ?", pointsEarned, req.user.userId);
            initialize_1.dbHelper.save();
        }
        res.json({ success: true, data: { isCorrect, pointsEarned, correctAnswer: q.correct_answer, explanation: q.explanation, youtubeLink: q.youtube_link } });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=question.routes.js.map