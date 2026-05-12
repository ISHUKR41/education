/**
 * FILE: class.routes.ts
 * PURPOSE: Academic class endpoints (Class 9-12, Engineering).
 */
import { Router, Request, Response, NextFunction } from "express";
import { dbHelper } from "../database/initialize";
import { AppError } from "../middleware/error.middleware";
const router = Router();

router.get("/", (_req: Request, res: Response, next: NextFunction) => {
  try {
    const classes = dbHelper.all("SELECT * FROM classes WHERE is_active = 1 ORDER BY sort_order ASC");
    res.json({ success: true, data: { classes } });
  } catch (error) { next(error); }
});

router.get("/:classId", (req: Request, res: Response, next: NextFunction) => {
  try {
    const cls = dbHelper.get("SELECT * FROM classes WHERE id = ? AND is_active = 1", req.params.classId);
    if (!cls) throw new AppError("Class not found.", 404, "CLASS_NOT_FOUND");
    const subjects = dbHelper.all("SELECT * FROM subjects WHERE class_id = ? AND is_active = 1 ORDER BY sort_order ASC", req.params.classId);
    res.json({ success: true, data: { class: cls, subjects } });
  } catch (error) { next(error); }
});

export default router;
