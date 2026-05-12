"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * FILE: topic.routes.ts
 * PURPOSE: Topic endpoints — list by chapter, get details with questions.
 */
const express_1 = require("express");
const initialize_1 = require("../database/initialize");
const error_middleware_1 = require("../middleware/error.middleware");
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => {
    try {
        const { chapterId } = req.query;
        const topics = chapterId
            ? initialize_1.dbHelper.all("SELECT * FROM topics WHERE chapter_id = ? AND is_active = 1 ORDER BY sort_order ASC", chapterId)
            : initialize_1.dbHelper.all("SELECT * FROM topics WHERE is_active = 1 ORDER BY sort_order ASC LIMIT 50");
        res.json({ success: true, data: { topics } });
    }
    catch (error) {
        next(error);
    }
});
router.get("/:topicId", (req, res, next) => {
    try {
        const topic = initialize_1.dbHelper.get("SELECT * FROM topics WHERE id = ? AND is_active = 1", req.params.topicId);
        if (!topic)
            throw new error_middleware_1.AppError("Topic not found.", 404, "TOPIC_NOT_FOUND");
        const questions = initialize_1.dbHelper.all("SELECT * FROM questions WHERE topic_id = ? AND is_active = 1 ORDER BY sort_order ASC", req.params.topicId);
        res.json({ success: true, data: { topic, questions } });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=topic.routes.js.map