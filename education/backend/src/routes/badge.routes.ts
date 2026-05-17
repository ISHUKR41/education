/**
 * FILE: badge.routes.ts
 * PURPOSE: Badge/achievement system.
 */
import { Router, Request, Response, NextFunction } from "express";
import { dbHelper } from "../database/initialize";
import { authenticate } from "../middleware/auth.middleware";
const router = Router();

router.get("/", (_req: Request, res: Response, next: NextFunction) => {
  try {
    const badges = dbHelper.all("SELECT * FROM badges WHERE is_active = 1 ORDER BY sort_order ASC");
    res.json({ success: true, data: { badges } });
  } catch (error) { next(error); }
});

router.get("/earned", authenticate, (req: Request, res: Response, next: NextFunction) => {
  try {
    const earned = dbHelper.all("SELECT b.*, ub.earned_at FROM badges b INNER JOIN user_badges ub ON ub.badge_id = b.id WHERE ub.user_id = ? ORDER BY ub.earned_at DESC", req.user!.userId);
    res.json({ success: true, data: { badges: earned } });
  } catch (error) { next(error); }
});

export default router;
