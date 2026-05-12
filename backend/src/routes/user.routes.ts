/**
 * FILE: user.routes.ts
 * PURPOSE: User profile management — get, update, list users.
 */

import { Router, Request, Response, NextFunction } from "express";
import { dbHelper } from "../database/initialize";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { AppError } from "../middleware/error.middleware";

const router = Router();

router.get("/profile", authenticate, (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = dbHelper.get(`
      SELECT u.id, u.email, u.display_name, u.avatar_url, u.role, u.created_at,
             sp.class_id, sp.stream, sp.board, sp.total_points, sp.current_level,
             sp.current_streak, sp.longest_streak, sp.skill_level
      FROM users u LEFT JOIN student_profiles sp ON sp.user_id = u.id WHERE u.id = ?
    `, req.user!.userId);
    if (!user) throw new AppError("User not found.", 404, "USER_NOT_FOUND");
    res.json({ success: true, data: { user } });
  } catch (error) { next(error); }
});

router.patch("/profile", authenticate, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { displayName, avatarUrl, classId, stream, board, skillLevel } = req.body;
    if (displayName) dbHelper.run("UPDATE users SET display_name = ?, updated_at = datetime('now') WHERE id = ?", displayName, req.user!.userId);
    if (avatarUrl) dbHelper.run("UPDATE users SET avatar_url = ?, updated_at = datetime('now') WHERE id = ?", avatarUrl, req.user!.userId);
    if (classId) dbHelper.run("UPDATE student_profiles SET class_id = ?, updated_at = datetime('now') WHERE user_id = ?", classId, req.user!.userId);
    if (stream) dbHelper.run("UPDATE student_profiles SET stream = ?, updated_at = datetime('now') WHERE user_id = ?", stream, req.user!.userId);
    if (board) dbHelper.run("UPDATE student_profiles SET board = ?, updated_at = datetime('now') WHERE user_id = ?", board, req.user!.userId);
    if (skillLevel) dbHelper.run("UPDATE student_profiles SET skill_level = ?, updated_at = datetime('now') WHERE user_id = ?", skillLevel, req.user!.userId);
    dbHelper.save();
    res.json({ success: true, message: "Profile updated." });
  } catch (error) { next(error); }
});

router.get("/", authenticate, authorize("admin", "super_admin"), (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = (page - 1) * limit;
    const users = dbHelper.all("SELECT id, email, display_name, role, is_active, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?", limit, offset);
    const total = dbHelper.get("SELECT COUNT(*) as count FROM users");
    res.json({ success: true, data: { users, pagination: { page, limit, total: (total?.count as number) || 0 } } });
  } catch (error) { next(error); }
});

export default router;
