/**
 * FILE: battle.routes.ts
 * PURPOSE: Battle/competition system — matchmaking, challenges.
 */
import { Router, Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { dbHelper } from "../database/initialize";
import { authenticate } from "../middleware/auth.middleware";
import { AppError } from "../middleware/error.middleware";
const router = Router();

router.get("/", authenticate, (req: Request, res: Response, next: NextFunction) => {
  try {
    const battles = dbHelper.all("SELECT * FROM battles WHERE status IN ('waiting', 'in_progress') ORDER BY created_at DESC LIMIT 20");
    res.json({ success: true, data: { battles } });
  } catch (error) { next(error); }
});

router.post("/", authenticate, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subjectId, difficulty, type } = req.body;
    const battleId = uuidv4();
    dbHelper.run("INSERT INTO battles (id, creator_id, subject_id, difficulty, type, status) VALUES (?, ?, ?, ?, ?, 'waiting')",
      battleId, req.user!.userId, subjectId, difficulty || "medium", type || "1v1");
    dbHelper.save();
    res.status(201).json({ success: true, data: { battleId }, message: "Battle created!" });
  } catch (error) { next(error); }
});

router.post("/:battleId/join", authenticate, (req: Request, res: Response, next: NextFunction) => {
  try {
    const battle = dbHelper.get("SELECT * FROM battles WHERE id = ? AND status = 'waiting'", req.params.battleId);
    if (!battle) throw new AppError("Battle not found or started.", 404, "BATTLE_NOT_FOUND");
    if (battle.creator_id === req.user!.userId) throw new AppError("Cannot join own battle.", 400, "SELF_JOIN");
    dbHelper.run("UPDATE battles SET opponent_id = ?, status = 'in_progress', started_at = datetime('now') WHERE id = ?", req.user!.userId, req.params.battleId);
    dbHelper.save();
    res.json({ success: true, message: "Battle joined! Good luck!" });
  } catch (error) { next(error); }
});

export default router;
