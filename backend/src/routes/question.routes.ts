/**
 * FILE: question.routes.ts
 * PURPOSE: Question endpoints — list, submit answers with scoring.
 */
import { Router, Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { dbHelper } from "../database/initialize";
import { authenticate } from "../middleware/auth.middleware";
import { AppError } from "../middleware/error.middleware";
const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topicId, difficulty } = req.query;
    let sql = "SELECT id, topic_id, type, question_text, options, difficulty, points, time_limit_seconds FROM questions WHERE is_active = 1";
    const params: unknown[] = [];
    if (topicId) { sql += " AND topic_id = ?"; params.push(topicId); }
    if (difficulty) { sql += " AND difficulty = ?"; params.push(difficulty); }
    sql += " ORDER BY sort_order ASC LIMIT 50";
    const questions = dbHelper.all(sql, ...params);
    res.json({ success: true, data: { questions } });
  } catch (error) { next(error); }
});

router.post("/:questionId/submit", authenticate, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { answer } = req.body;
    const q = dbHelper.get("SELECT * FROM questions WHERE id = ?", req.params.questionId);
    if (!q) throw new AppError("Question not found.", 404, "QUESTION_NOT_FOUND");

    const isCorrect = String(answer).trim().toLowerCase() === String(q.correct_answer).trim().toLowerCase();
    const pointsEarned = isCorrect ? (q.points as number) : 0;

    if (isCorrect) {
      dbHelper.run("INSERT INTO points_transactions (id, user_id, amount, type, source, description) VALUES (?, ?, ?, 'earned', 'question', ?)",
        uuidv4(), req.user!.userId, pointsEarned, `Correct answer`);
      dbHelper.run("UPDATE student_profiles SET total_points = total_points + ?, updated_at = datetime('now') WHERE user_id = ?",
        pointsEarned, req.user!.userId);
      dbHelper.save();
    }

    res.json({ success: true, data: { isCorrect, pointsEarned, correctAnswer: q.correct_answer, explanation: q.explanation, youtubeLink: q.youtube_link } });
  } catch (error) { next(error); }
});

export default router;
