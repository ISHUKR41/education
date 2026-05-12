"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * FILE: battle.routes.ts
 * PURPOSE: Battle/competition system — matchmaking, challenges.
 */
const express_1 = require("express");
const uuid_1 = require("uuid");
const initialize_1 = require("../database/initialize");
const auth_middleware_1 = require("../middleware/auth.middleware");
const error_middleware_1 = require("../middleware/error.middleware");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authenticate, (req, res, next) => {
    try {
        const battles = initialize_1.dbHelper.all("SELECT * FROM battles WHERE status IN ('waiting', 'in_progress') ORDER BY created_at DESC LIMIT 20");
        res.json({ success: true, data: { battles } });
    }
    catch (error) {
        next(error);
    }
});
router.post("/", auth_middleware_1.authenticate, (req, res, next) => {
    try {
        const { subjectId, difficulty, type } = req.body;
        const battleId = (0, uuid_1.v4)();
        initialize_1.dbHelper.run("INSERT INTO battles (id, creator_id, subject_id, difficulty, type, status) VALUES (?, ?, ?, ?, ?, 'waiting')", battleId, req.user.userId, subjectId, difficulty || "medium", type || "1v1");
        initialize_1.dbHelper.save();
        res.status(201).json({ success: true, data: { battleId }, message: "Battle created!" });
    }
    catch (error) {
        next(error);
    }
});
router.post("/:battleId/join", auth_middleware_1.authenticate, (req, res, next) => {
    try {
        const battle = initialize_1.dbHelper.get("SELECT * FROM battles WHERE id = ? AND status = 'waiting'", req.params.battleId);
        if (!battle)
            throw new error_middleware_1.AppError("Battle not found or started.", 404, "BATTLE_NOT_FOUND");
        if (battle.creator_id === req.user.userId)
            throw new error_middleware_1.AppError("Cannot join own battle.", 400, "SELF_JOIN");
        initialize_1.dbHelper.run("UPDATE battles SET opponent_id = ?, status = 'in_progress', started_at = datetime('now') WHERE id = ?", req.user.userId, req.params.battleId);
        initialize_1.dbHelper.save();
        res.json({ success: true, message: "Battle joined! Good luck!" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=battle.routes.js.map