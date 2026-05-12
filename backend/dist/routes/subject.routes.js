"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * FILE: subject.routes.ts
 * PURPOSE: Subject endpoints — list subjects by class, get details with chapters.
 */
const express_1 = require("express");
const initialize_1 = require("../database/initialize");
const error_middleware_1 = require("../middleware/error.middleware");
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => {
    try {
        const { classId } = req.query;
        const subjects = classId
            ? initialize_1.dbHelper.all("SELECT * FROM subjects WHERE class_id = ? AND is_active = 1 ORDER BY sort_order ASC", classId)
            : initialize_1.dbHelper.all("SELECT * FROM subjects WHERE is_active = 1 ORDER BY class_id, sort_order ASC");
        res.json({ success: true, data: { subjects } });
    }
    catch (error) {
        next(error);
    }
});
router.get("/:subjectId", (req, res, next) => {
    try {
        const subject = initialize_1.dbHelper.get("SELECT * FROM subjects WHERE id = ? AND is_active = 1", req.params.subjectId);
        if (!subject)
            throw new error_middleware_1.AppError("Subject not found.", 404, "SUBJECT_NOT_FOUND");
        const chapters = initialize_1.dbHelper.all("SELECT * FROM chapters WHERE subject_id = ? AND is_active = 1 ORDER BY sort_order ASC", req.params.subjectId);
        res.json({ success: true, data: { subject, chapters } });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=subject.routes.js.map