/**
 * FILE: topic.routes.ts
 * PURPOSE: Topic endpoints — list by chapter, get details with questions.
 */
import { Router, Request, Response, NextFunction } from "express";
import { dbHelper } from "../database/initialize";
import { AppError } from "../middleware/error.middleware";
const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chapterId } = req.query;
    const topics = chapterId
      ? dbHelper.all("SELECT * FROM topics WHERE chapter_id = ? AND is_active = 1 ORDER BY sort_order ASC", chapterId)
      : dbHelper.all("SELECT * FROM topics WHERE is_active = 1 ORDER BY sort_order ASC LIMIT 50");
    res.json({ success: true, data: { topics } });
  } catch (error) { next(error); }
});

router.get("/:topicId", (req: Request, res: Response, next: NextFunction) => {
  try {
    const topic = dbHelper.get("SELECT * FROM topics WHERE id = ? AND is_active = 1", req.params.topicId);
    if (!topic) throw new AppError("Topic not found.", 404, "TOPIC_NOT_FOUND");
    const questions = dbHelper.all("SELECT * FROM questions WHERE topic_id = ? AND is_active = 1 ORDER BY sort_order ASC", req.params.topicId);
    res.json({ success: true, data: { topic, questions } });
  } catch (error) { next(error); }
});

export default router;
