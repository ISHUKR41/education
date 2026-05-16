"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * FILE: community.routes.ts
 * PURPOSE: Community features — forums, discussions.
 */
const express_1 = require("express");
const uuid_1 = require("uuid");
const initialize_1 = require("../database/initialize");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/posts", (_req, res, next) => {
    try {
        const posts = initialize_1.dbHelper.all("SELECT cp.*, u.display_name, u.avatar_url FROM community_posts cp INNER JOIN users u ON u.id = cp.author_id WHERE cp.is_active = 1 ORDER BY cp.created_at DESC LIMIT 20");
        res.json({ success: true, data: { posts } });
    }
    catch (error) {
        next(error);
    }
});
router.post("/posts", auth_middleware_1.authenticate, (req, res, next) => {
    try {
        const { title, content, category } = req.body;
        const postId = (0, uuid_1.v4)();
        initialize_1.dbHelper.run("INSERT INTO community_posts (id, author_id, title, content, category) VALUES (?, ?, ?, ?, ?)", postId, req.user.userId, title, content, category || "general");
        initialize_1.dbHelper.save();
        res.status(201).json({ success: true, data: { postId }, message: "Post created!" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=community.routes.js.map