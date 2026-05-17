/**
 * FILE: community.routes.ts
 * PURPOSE: Community features — forums, discussions.
 */
import { Router, Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { dbHelper } from "../database/initialize";
import { authenticate } from "../middleware/auth.middleware";
const router = Router();

router.get("/posts", (_req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = dbHelper.all("SELECT cp.*, u.display_name, u.avatar_url FROM community_posts cp INNER JOIN users u ON u.id = cp.author_id WHERE cp.is_active = 1 ORDER BY cp.created_at DESC LIMIT 20");
    res.json({ success: true, data: { posts } });
  } catch (error) { next(error); }
});

router.post("/posts", authenticate, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content, category } = req.body;
    const postId = uuidv4();
    dbHelper.run("INSERT INTO community_posts (id, author_id, title, content, category) VALUES (?, ?, ?, ?, ?)",
      postId, req.user!.userId, title, content, category || "general");
    dbHelper.save();
    res.status(201).json({ success: true, data: { postId }, message: "Post created!" });
  } catch (error) { next(error); }
});

export default router;
