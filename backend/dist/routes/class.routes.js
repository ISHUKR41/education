"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * FILE: class.routes.ts
 * PURPOSE: Academic class endpoints (Class 9-12, Engineering).
 */
const express_1 = require("express");
const initialize_1 = require("../database/initialize");
const error_middleware_1 = require("../middleware/error.middleware");
const router = (0, express_1.Router)();
router.get("/", (_req, res, next) => {
    try {
        const classes = initialize_1.dbHelper.all("SELECT * FROM classes WHERE is_active = 1 ORDER BY sort_order ASC");
        res.json({ success: true, data: { classes } });
    }
    catch (error) {
        next(error);
    }
});
router.get("/:classId", (req, res, next) => {
    try {
        const cls = initialize_1.dbHelper.get("SELECT * FROM classes WHERE id = ? AND is_active = 1", req.params.classId);
        if (!cls)
            throw new error_middleware_1.AppError("Class not found.", 404, "CLASS_NOT_FOUND");
        const subjects = initialize_1.dbHelper.all("SELECT * FROM subjects WHERE class_id = ? AND is_active = 1 ORDER BY sort_order ASC", req.params.classId);
        res.json({ success: true, data: { class: cls, subjects } });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=class.routes.js.map