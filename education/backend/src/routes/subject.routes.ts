/**
 * FILE: subject.routes.ts
 * PURPOSE: Subject endpoints — list subjects by class, get details with chapters.
 */
import { Router, Request, Response, NextFunction } from "express";
import { dbHelper } from "../database/initialize";
import { AppError } from "../middleware/error.middleware";
const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { classId } = req.query;
    const subjects = classId
      ? dbHelper.all("SELECT * FROM subjects WHERE class_id = ? AND is_active = 1 ORDER BY sort_order ASC", classId)
      : dbHelper.all("SELECT * FROM subjects WHERE is_active = 1 ORDER BY class_id, sort_order ASC");
    res.json({ success: true, data: { subjects } });
  } catch (error) { next(error); }
});

router.get("/:subjectId", (req: Request, res: Response, next: NextFunction) => {
  try {
    const subject = dbHelper.get("SELECT * FROM subjects WHERE id = ? AND is_active = 1", req.params.subjectId);
    if (!subject) throw new AppError("Subject not found.", 404, "SUBJECT_NOT_FOUND");
    const chapters = dbHelper.all("SELECT * FROM chapters WHERE subject_id = ? AND is_active = 1 ORDER BY sort_order ASC", req.params.subjectId);
    res.json({ success: true, data: { subject, chapters } });
  } catch (error) { next(error); }
});

export default router;
