/**
 * FILE: streak.routes.ts
 * PURPOSE: Streak management — daily check-in, streak history.
 */
import { Router, Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { dbHelper } from "../database/initialize";
import { authenticate } from "../middleware/auth.middleware";
const router = Router();

router.get("/", authenticate, (req: Request, res: Response, next: NextFunction) => {
  try {
    const streaks = dbHelper.all("SELECT * FROM streaks WHERE user_id = ? ORDER BY date DESC LIMIT 30", req.user!.userId);
    const profile = dbHelper.get("SELECT current_streak, longest_streak FROM student_profiles WHERE user_id = ?", req.user!.userId);
    res.json({ success: true, data: { streaks, ...(profile || {}) } });
  } catch (error) { next(error); }
});

router.post("/checkin", authenticate, (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const existing = dbHelper.get("SELECT id FROM streaks WHERE user_id = ? AND date = ?", req.user!.userId, today);
    if (existing) return res.json({ success: true, message: "Already checked in today!", alreadyCheckedIn: true });

    dbHelper.run("INSERT INTO streaks (id, user_id, date, activity_type) VALUES (?, ?, ?, 'daily_checkin')", uuidv4(), req.user!.userId, today);
    dbHelper.run("UPDATE student_profiles SET current_streak = current_streak + 1, longest_streak = MAX(longest_streak, current_streak + 1), updated_at = datetime('now') WHERE user_id = ?", req.user!.userId);
    dbHelper.save();
    res.json({ success: true, message: "Checked in! Streak maintained." });
  } catch (error) { next(error); }
});

export default router;
