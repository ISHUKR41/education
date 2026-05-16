"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * FILE: event.routes.ts
 * PURPOSE: Events/competitions management.
 */
const express_1 = require("express");
const initialize_1 = require("../database/initialize");
const router = (0, express_1.Router)();
router.get("/", (_req, res, next) => {
    try {
        const events = initialize_1.dbHelper.all("SELECT * FROM events WHERE is_active = 1 ORDER BY start_date ASC LIMIT 20");
        res.json({ success: true, data: { events } });
    }
    catch (error) {
        next(error);
    }
});
router.get("/:eventId", (req, res, next) => {
    try {
        const event = initialize_1.dbHelper.get("SELECT * FROM events WHERE id = ?", req.params.eventId);
        if (!event)
            return res.status(404).json({ success: false, error: { message: "Event not found." } });
        res.json({ success: true, data: { event } });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=event.routes.js.map