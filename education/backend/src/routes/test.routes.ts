/**
 * FILE: test.routes.ts
 * PURPOSE: Test management — list, start, complete tests with scoring.
 */
import { Router, Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { dbHelper } from "../database/initialize";
import { authenticate } from "../middleware/auth.middleware";
import { AppError } from "../middleware/error.middleware";
const router = Router();

router.get("/", (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tests = dbHelper.all("SELECT * FROM tests WHERE is_active = 1 ORDER BY created_at DESC LIMIT 50");
    res.json({ success: true, data: { tests } });
  } catch (error) { next(error); }
});

router.get("/:testId", (req: Request, res: Response, next: NextFunction) => {
  try {
    const test = dbHelper.get("SELECT * FROM tests WHERE id = ? AND is_active = 1", req.params.testId);
    if (!test) throw new AppError("Test not found.", 404, "TEST_NOT_FOUND");
    res.json({ success: true, data: { test } });
  } catch (error) { next(error); }
});

router.post("/:testId/start", authenticate, (req: Request, res: Response, next: NextFunction) => {
  try {
    const test = dbHelper.get("SELECT * FROM tests WHERE id = ? AND is_active = 1", req.params.testId);
    if (!test) throw new AppError("Test not found.", 404, "TEST_NOT_FOUND");
    const attemptId = uuidv4();
    dbHelper.run("INSERT INTO test_attempts (id, test_id, user_id, total_questions, status) VALUES (?, ?, ?, ?, 'in_progress')",
      attemptId, req.params.testId, req.user!.userId, test.total_questions);
    dbHelper.save();
    res.status(201).json({ success: true, data: { attemptId } });
  } catch (error) { next(error); }
});

router.post("/:testId/complete", authenticate, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { attemptId, score, correctAnswers, wrongAnswers, skipped, timeTaken } = req.body;
    dbHelper.run("UPDATE test_attempts SET score = ?, correct_answers = ?, wrong_answers = ?, skipped = ?, time_taken_seconds = ?, status = 'completed', completed_at = datetime('now') WHERE id = ? AND user_id = ?",
      score, correctAnswers, wrongAnswers, skipped, timeTaken, attemptId, req.user!.userId);
    const pts = Math.round((score || 0) * 0.5);
    if (pts > 0) {
      dbHelper.run("INSERT INTO points_transactions (id, user_id, amount, type, source, description) VALUES (?, ?, ?, 'earned', 'test', ?)",
        uuidv4(), req.user!.userId, pts, `Test completed`);
      dbHelper.run("UPDATE student_profiles SET total_points = total_points + ?, updated_at = datetime('now') WHERE user_id = ?", pts, req.user!.userId);
    }
    dbHelper.save();
    res.json({ success: true, data: { pointsEarned: pts }, message: "Test completed!" });
  } catch (error) { next(error); }
});

export default router;
