/**
 * FILE: event.routes.ts
 * PURPOSE: Events/competitions management.
 */
import { Router, Request, Response, NextFunction } from "express";
import { dbHelper } from "../database/initialize";
const router = Router();

router.get("/", (_req: Request, res: Response, next: NextFunction) => {
  try {
    const events = dbHelper.all("SELECT * FROM events WHERE is_active = 1 ORDER BY start_date ASC LIMIT 20");
    res.json({ success: true, data: { events } });
  } catch (error) { next(error); }
});

router.get("/:eventId", (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = dbHelper.get("SELECT * FROM events WHERE id = ?", req.params.eventId);
    if (!event) return res.status(404).json({ success: false, error: { message: "Event not found." } });
    res.json({ success: true, data: { event } });
  } catch (error) { next(error); }
});

export default router;
