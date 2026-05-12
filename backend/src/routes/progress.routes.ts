/**
 * FILE: progress.routes.ts
 * PURPOSE: Student learning progress tracking.
 */
import { Router, Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { dbHelper } from "../database/initialize";
import { authenticate } from "../middleware/auth.middleware";
const router = Router();

router.get("/", authenticate, (req: Request, res: Response, next: NextFunction) => {
  try {
    const progress = dbHelper.all("SELECT * FROM progress WHERE user_id = ? ORDER BY updated_at DESC", req.user!.userId);
    res.json({ success: true, data: { progress } });
  } catch (error) { next(error); }
});

router.post("/", authenticate, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topicId, status, percentComplete, timeSpentSeconds } = req.body;
    const existing = dbHelper.get("SELECT id FROM progress WHERE user_id = ? AND topic_id = ?", req.user!.userId, topicId);
    if (existing) {
      dbHelper.run("UPDATE progress SET status = ?, percent_complete = ?, time_spent_seconds = time_spent_seconds + ?, updated_at = datetime('now') WHERE id = ?",
        status, percentComplete, timeSpentSeconds || 0, existing.id);
    } else {
      dbHelper.run("INSERT INTO progress (id, user_id, topic_id, status, percent_complete, time_spent_seconds) VALUES (?, ?, ?, ?, ?, ?)",
        uuidv4(), req.user!.userId, topicId, status, percentComplete, timeSpentSeconds || 0);
    }
    dbHelper.save();
    res.json({ success: true, message: "Progress updated." });
  } catch (error) { next(error); }
});

export default router;
