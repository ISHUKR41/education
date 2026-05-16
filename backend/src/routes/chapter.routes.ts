/**
 * FILE: chapter.routes.ts
 * PURPOSE: Chapter endpoints — list by subject, get details with topics.
 */
import { Router, Request, Response, NextFunction } from "express";
import { dbHelper } from "../database/initialize";
import { AppError } from "../middleware/error.middleware";
const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subjectId } = req.query;
    const chapters = subjectId
      ? dbHelper.all("SELECT * FROM chapters WHERE subject_id = ? AND is_active = 1 ORDER BY sort_order ASC", subjectId)
      : dbHelper.all("SELECT * FROM chapters WHERE is_active = 1 ORDER BY sort_order ASC LIMIT 50");
    res.json({ success: true, data: { chapters } });
  } catch (error) { next(error); }
});

router.get("/:chapterId", (req: Request, res: Response, next: NextFunction) => {
  try {
    const chapter = dbHelper.get("SELECT * FROM chapters WHERE id = ? AND is_active = 1", req.params.chapterId);
    if (!chapter) throw new AppError("Chapter not found.", 404, "CHAPTER_NOT_FOUND");
    const topics = dbHelper.all("SELECT * FROM topics WHERE chapter_id = ? AND is_active = 1 ORDER BY sort_order ASC", req.params.chapterId);
    res.json({ success: true, data: { chapter, topics } });
  } catch (error) { next(error); }
});

export default router;
