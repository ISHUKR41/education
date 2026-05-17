/**
 * FILE: leaderboard.routes.ts
 * PURPOSE: Leaderboard — global and class rankings.
 */
import { Router, Request, Response, NextFunction } from "express";
import { dbHelper } from "../database/initialize";
const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { classId } = req.query;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    let sql = "SELECT u.id, u.display_name, u.avatar_url, sp.total_points, sp.current_level, sp.current_streak, sp.class_id FROM student_profiles sp INNER JOIN users u ON u.id = sp.user_id WHERE u.is_active = 1";
    const params: unknown[] = [];
    if (classId) { sql += " AND sp.class_id = ?"; params.push(classId); }
    sql += " ORDER BY sp.total_points DESC LIMIT ?";
    params.push(limit);
    const rankings = dbHelper.all(sql, ...params);
    res.json({ success: true, data: { rankings } });
  } catch (error) { next(error); }
});

export default router;
