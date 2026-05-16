/**
 * FILE: health.routes.ts
 * PURPOSE: Health check endpoint for monitoring and load balancer probes.
 */

import { Router, Request, Response } from "express";
import { dbHelper } from "../database/initialize";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  let dbStatus = "connected";
  try { dbHelper.get("SELECT 1 as ok"); } catch { dbStatus = "disconnected"; }

  const mem = process.memoryUsage();
  res.status(200).json({
    success: true,
    data: {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
      environment: process.env.NODE_ENV || "development",
      database: dbStatus,
      memory: {
        heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)}MB`,
        rss: `${Math.round(mem.rss / 1024 / 1024)}MB`,
      },
      version: "1.0.0",
    },
  });
});

export default router;
