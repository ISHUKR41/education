"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * FILE: chapter.routes.ts
 * PURPOSE: Chapter endpoints — list by subject, get details with topics.
 */
const express_1 = require("express");
const initialize_1 = require("../database/initialize");
const error_middleware_1 = require("../middleware/error.middleware");
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => {
    try {
        const { subjectId } = req.query;
        const chapters = subjectId
            ? initialize_1.dbHelper.all("SELECT * FROM chapters WHERE subject_id = ? AND is_active = 1 ORDER BY sort_order ASC", subjectId)
            : initialize_1.dbHelper.all("SELECT * FROM chapters WHERE is_active = 1 ORDER BY sort_order ASC LIMIT 50");
        res.json({ success: true, data: { chapters } });
    }
    catch (error) {
        next(error);
    }
});
router.get("/:chapterId", (req, res, next) => {
    try {
        const chapter = initialize_1.dbHelper.get("SELECT * FROM chapters WHERE id = ? AND is_active = 1", req.params.chapterId);
        if (!chapter)
            throw new error_middleware_1.AppError("Chapter not found.", 404, "CHAPTER_NOT_FOUND");
        const topics = initialize_1.dbHelper.all("SELECT * FROM topics WHERE chapter_id = ? AND is_active = 1 ORDER BY sort_order ASC", req.params.chapterId);
        res.json({ success: true, data: { chapter, topics } });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=chapter.routes.js.map