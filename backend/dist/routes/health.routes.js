"use strict";
/**
 * FILE: health.routes.ts
 * PURPOSE: Health check endpoint for monitoring and load balancer probes.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const initialize_1 = require("../database/initialize");
const router = (0, express_1.Router)();
router.get("/", (_req, res) => {
    let dbStatus = "connected";
    try {
        initialize_1.dbHelper.get("SELECT 1 as ok");
    }
    catch {
        dbStatus = "disconnected";
    }
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
exports.default = router;
//# sourceMappingURL=health.routes.js.map