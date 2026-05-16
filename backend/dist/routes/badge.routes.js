"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * FILE: badge.routes.ts
 * PURPOSE: Badge/achievement system.
 */
const express_1 = require("express");
const initialize_1 = require("../database/initialize");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", (_req, res, next) => {
    try {
        const badges = initialize_1.dbHelper.all("SELECT * FROM badges WHERE is_active = 1 ORDER BY sort_order ASC");
        res.json({ success: true, data: { badges } });
    }
    catch (error) {
        next(error);
    }
});
router.get("/earned", auth_middleware_1.authenticate, (req, res, next) => {
    try {
        const earned = initialize_1.dbHelper.all("SELECT b.*, ub.earned_at FROM badges b INNER JOIN user_badges ub ON ub.badge_id = b.id WHERE ub.user_id = ? ORDER BY ub.earned_at DESC", req.user.userId);
        res.json({ success: true, data: { badges: earned } });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=badge.routes.js.map