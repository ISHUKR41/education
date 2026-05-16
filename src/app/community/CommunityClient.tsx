/**
 * FILE: CommunityClient.tsx
 * LOCATION: src/app/community/CommunityClient.tsx
 * PURPOSE: Interactive community feed. It loads persisted posts from the API,
 *          supports category filtering, and lets signed-in users create posts.
 * USED BY: src/app/community/page.tsx
 * DEPENDENCIES: lucide-react, Community.module.css, community posts API
 * LAST UPDATED: 2026-05-11
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, BookOpen, Code2, Eye, Loader2, MessageSquare, Send, ThumbsUp, Trophy, Users } from "lucide-react";
import type { CommunityPost } from "@/lib/server/data/platform-store";
import styles from "./Community.module.css";

interface PostsApiResponse {
  ok: boolean;
  data?: { posts: CommunityPost[]; post?: CommunityPost };
  error?: { message: string };
}

const CATEGORIES = [
  { name: "General", tag: "general", icon: Users, color: "#3B82F6", bg: "#EFF6FF" },
  { name: "Class 9-10", tag: "class", icon: BookOpen, color: "#10B981", bg: "#ECFDF5" },
  { name: "Engineering", tag: "engineering", icon: Code2, color: "#F59E0B", bg: "#FFFBEB" },
  { name: "Competitions", tag: "battle", icon: Trophy, color: "#EF4444", bg: "#FEF2F2" },
];

/** Formats a post timestamp into a short student-friendly label. */
function formatPostTime(isoDate: string): string {
  const minutes = Math.max(1, Math.round((Date.now() - Date.parse(isoDate)) / 60000));

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.round(minutes / 60);
  return hours < 24 ? `${hours}h ago` : `${Math.round(hours / 24)}d ago`;
}

/** Renders persisted community posts with a small create-post form. */
export default function CommunityClient() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [activeCategory, setActiveCategory] = useState("general");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tagText, setTagText] = useState("General");
  const [status, setStatus] = useState<"idle" | "loading" | "posting" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      setStatus("loading");
      setMessage("");

      try {
        /*
         * API call: GET /api/community/posts
         * Why: loads persisted community discussions from the backend data adapter.
         */
        const response = await fetch("/api/community/posts", { cache: "no-store" });
        const payload = (await response.json()) as PostsApiResponse;

        if (!isMounted) {
          return;
        }

        if (!response.ok || !payload.ok || !payload.data) {
          setStatus("error");
          setMessage(payload.error?.message ?? "Unable to load community posts.");
          return;
        }

        setPosts(payload.data.posts);
        setStatus("idle");
      } catch {
        if (isMounted) {
          setStatus("error");
          setMessage("Network error while loading community posts.");
        }
      }
    }

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const visiblePosts = useMemo(() => {
    if (activeCategory === "general") {
      return posts;
    }

    return posts.filter((post) =>
      post.tags.some((tag) => tag.toLowerCase().includes(activeCategory)),
    );
  }, [activeCategory, posts]);

  /** Creates a new post through the protected community API route. */
  const handleCreatePost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("posting");
    setMessage("");

    const tags = tagText
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 4);

    try {
      /*
       * API call: POST /api/community/posts
       * Why: persists a signed-in student's question so it remains after refresh/restart.
       */
      const response = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, tags }),
      });
      const payload = (await response.json()) as PostsApiResponse;

      if (response.status === 401) {
        setStatus("error");
        setMessage("Please sign in before posting.");
        return;
      }

      if (!response.ok || !payload.ok || !payload.data?.post) {
        setStatus("error");
        setMessage(payload.error?.message ?? "Unable to create post.");
        return;
      }

      setPosts((currentPosts) => [payload.data!.post!, ...currentPosts]);
      setTitle("");
      setBody("");
      setTagText("General");
      setStatus("idle");
      setMessage("Post created successfully.");
    } catch {
      setStatus("error");
      setMessage("Network error while creating your post.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>Community</h1>
          <p className={styles.subtitle}>Ask questions, share knowledge, and learn together.</p>
        </div>

        <div className={styles.grid}>
          <main className={styles.postList}>
            <form className={styles.createPost} onSubmit={handleCreatePost}>
              <h2>Ask a Question</h2>
              <input
                className={styles.createInput}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Short question title"
                required
              />
              <textarea
                className={styles.createTextarea}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Explain what you tried and where you are stuck"
                required
              />
              <input
                className={styles.createInput}
                value={tagText}
                onChange={(event) => setTagText(event.target.value)}
                placeholder="Tags: Class 10, Mathematics"
                required
              />
              <button className={styles.createButton} type="submit" disabled={status === "posting"}>
                {status === "posting" ? <Loader2 size={16} className={styles.spinner} /> : <Send size={16} />}
                {status === "posting" ? "Posting..." : "Post Question"}
              </button>
              {message && (
                <div className={`${styles.message} ${status === "error" ? styles.messageError : styles.messageSuccess}`} role="status">
                  <AlertCircle size={15} />
                  <span>{message}</span>
                  {status === "error" && <Link href="/sign-in">Sign In</Link>}
                </div>
              )}
            </form>

            {status === "loading" ? (
              <div className={styles.loadingCard}><Loader2 className={styles.spinner} /> Loading discussions...</div>
            ) : (
              visiblePosts.map((post) => (
                <article key={post.id} className={styles.postCard}>
                  <div className={styles.postHeader}>
                    <div className={styles.postAvatar}>{post.authorName.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div>
                    <div>
                      <div className={styles.postAuthor}>{post.authorName}</div>
                      <div className={styles.postTime}>{formatPostTime(post.createdAt)}</div>
                    </div>
                  </div>

                  <div>
                    {post.tags.map((tag) => (
                      <span key={tag} className={styles.postTag}>{tag}</span>
                    ))}
                  </div>

                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <p className={styles.postBody}>{post.body}</p>

                  <div className={styles.postFooter}>
                    <span className={styles.postStat}><ThumbsUp size={14} /> {post.likes}</span>
                    <span className={styles.postStat}><MessageSquare size={14} /> {post.comments}</span>
                    <span className={styles.postStat}><Eye size={14} /> {post.views}</span>
                  </div>
                </article>
              ))
            )}
          </main>

          <aside>
            <h3 className={styles.sidebarTitle}>Categories</h3>
            <div className={styles.categories}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  className={`${styles.categoryCard} ${activeCategory === cat.tag ? styles.categoryCardActive : ""}`}
                  onClick={() => setActiveCategory(cat.tag)}
                  type="button"
                >
                  <div className={styles.categoryIcon} style={{ background: cat.bg, color: cat.color }}>
                    <cat.icon size={18} />
                  </div>
                  <span className={styles.categoryName}>{cat.name}</span>
                  <span className={styles.categoryCount}>
                    {cat.tag === "general" ? posts.length : posts.filter((post) => post.tags.some((tag) => tag.toLowerCase().includes(cat.tag))).length}
                  </span>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
