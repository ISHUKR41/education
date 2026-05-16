/**
 * FILE: user.routes.ts
 * PURPOSE: User profile management — get, update, list users.
 */

import { Router, Request, Response, NextFunction } from "express";
import prisma from "../database/prisma";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { AppError } from "../middleware/error.middleware";

const router = Router();

router.get("/profile", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: req.user!.userId },
      include: {
        studentProfile: true
      }
    });
    if (!user) throw new AppError("User not found.", 404, "USER_NOT_FOUND");
    res.json({ success: true, data: { user } });
  } catch (error) { next(error); }
});

router.patch("/profile", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      displayName,
      classId,
      stream,
      board,
      skillLevel,
      languagePreference,
      phone,
      parentPhone,
      institution,
    } = req.body;
    const userId = req.user!.userId;
    const userUpdates: { name?: string } = {};
    const profileUpdates: {
      classId?: string;
      stream?: string;
      board?: string;
      skillLevel?: string;
      languagePreference?: string;
      phone?: string;
      parentPhone?: string;
      institution?: string;
    } = {};

    if (typeof displayName === "string" && displayName.trim()) userUpdates.name = displayName.trim();
    if (typeof classId === "string" && classId.trim()) profileUpdates.classId = classId.trim();
    if (typeof stream === "string" && stream.trim()) profileUpdates.stream = stream.trim();
    if (typeof board === "string" && board.trim()) profileUpdates.board = board.trim();
    if (typeof skillLevel === "string" && skillLevel.trim()) profileUpdates.skillLevel = skillLevel.trim();
    if (typeof languagePreference === "string" && languagePreference.trim()) profileUpdates.languagePreference = languagePreference.trim();
    if (typeof phone === "string" && phone.trim()) profileUpdates.phone = phone.trim();
    if (typeof parentPhone === "string" && parentPhone.trim()) profileUpdates.parentPhone = parentPhone.trim();
    if (typeof institution === "string" && institution.trim()) profileUpdates.institution = institution.trim();

    // Keep account identity and learning-profile metadata in their own tables.
    if (Object.keys(userUpdates).length > 0) {
      await prisma.user.update({ where: { id: userId }, data: userUpdates });
    }

    if (Object.keys(profileUpdates).length > 0) {
      await prisma.studentProfile.upsert({
        where: { userId },
        update: profileUpdates,
        create: { userId, ...profileUpdates },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true },
    });

    res.json({ success: true, data: { user }, message: "Profile updated." });
  } catch (error) { next(error); }
});

router.get("/", authenticate, authorize("ADMIN", "SUPER_ADMIN"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          currentLevel: true,
          xp: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.user.count(),
    ]);

    res.json({ success: true, data: { users, pagination: { page, limit, total } } });
  } catch (error) { next(error); }
});

export default router;
