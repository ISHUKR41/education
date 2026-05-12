/**
 * FILE: dashboard.routes.ts
 * PURPOSE: Dashboard data aggregation.
 */
import { Router, Request, Response, NextFunction } from "express";
import { dbHelper } from "../database/initialize";
import { authenticate } from "../middleware/auth.middleware";
const router = Router();

router.get("/", authenticate, (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = dbHelper.get(`
      SELECT u.display_name, u.email, u.avatar_url, u.role,
             sp.total_points, sp.current_level, sp.current_streak,
             sp.longest_streak, sp.class_id, sp.stream, sp.skill_level
      FROM users u LEFT JOIN student_profiles sp ON sp.user_id = u.id WHERE u.id = ?
    `, req.user!.userId);

    const recentActivity = dbHelper.all("SELECT * FROM points_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 10", req.user!.userId);
    const badges = dbHelper.all("SELECT b.* FROM badges b INNER JOIN user_badges ub ON ub.badge_id = b.id WHERE ub.user_id = ? ORDER BY ub.earned_at DESC", req.user!.userId);
    const recentTests = dbHelper.all("SELECT ta.*, t.title as test_title FROM test_attempts ta INNER JOIN tests t ON t.id = ta.test_id WHERE ta.user_id = ? ORDER BY ta.created_at DESC LIMIT 5", req.user!.userId);
    const streakHistory = dbHelper.all("SELECT date, points_earned FROM streaks WHERE user_id = ? AND date >= date('now', '-30 days') ORDER BY date DESC", req.user!.userId);

    res.json({ success: true, data: { profile, recentActivity, badges, recentTests, streakHistory } });
  } catch (error) { next(error); }
});

export default router;
