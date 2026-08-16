import { useEffect, useState } from "react";
import { Heart, MessageCircle, Loader2, Send, Share2, Bookmark } from "lucide-react";
import {
  togglePostLike,
  getPostComments,
  addPostComment,
  resolveImageUrl,
  getApiErrorMessage,
} from "../../lib/communityApi";
import { showError, showSuccess } from "../../lib/toast";

function Avatar({ name }) {
  const initial = (name || "U").charAt(0).toUpperCase();
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
      style={{ backgroundColor: "var(--dash-accent)" }}
    >
      {initial}
    </div>
  );
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function CommunityPostCard({ post, onLikeUpdate }) {
  const [liked, setLiked] = useState(post.likedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [likePending, setLikePending] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount);

  useEffect(() => {
    setLiked(post.likedByMe);
    setLikeCount(post.likeCount);
    setCommentCount(post.commentCount);
  }, [post]);

  const handleLike = async () => {
    const prevLiked = liked;
    const prevCount = likeCount;
    setLiked(!prevLiked);
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);
    setLikePending(true);

    try {
      const { data } = await togglePostLike(post.id);
      setLiked(data.likedByMe);
      setLikeCount(data.likeCount);
      onLikeUpdate?.(post.id, data);
    } catch (err) {
      setLiked(prevLiked);
      setLikeCount(prevCount);
      showError(getApiErrorMessage(err, "Could not update like."));
    } finally {
      setLikePending(false);
    }
  };

  const loadComments = async () => {
    setCommentsLoading(true);
    try {
      const { data } = await getPostComments(post.id);
      setComments(data.items || []);
    } catch (err) {
      showError(getApiErrorMessage(err, "Could not load comments."));
    } finally {
      setCommentsLoading(false);
    }
  };

  const toggleComments = () => {
    const next = !commentsOpen;
    setCommentsOpen(next);
    if (next && comments.length === 0) {
      loadComments();
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text) {
      showError("Please write a comment before submitting.");
      return;
    }

    setCommentSubmitting(true);
    try {
      const { data } = await addPostComment(post.id, text);
      setComments((prev) => [...prev, data]);
      setCommentCount((c) => c + 1);
      setCommentText("");
      showSuccess("Comment added");
    } catch (err) {
      showError(getApiErrorMessage(err, "Could not add comment."));
    } finally {
      setCommentSubmitting(false);
    }
  };

  return (
    <article
      className="overflow-hidden rounded-lg border"
      style={{ borderColor: "var(--dash-border)", backgroundColor: "var(--dash-surface)" }}
    >
      {/* Post Header */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <Avatar name={post.author?.name} />
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold" style={{ color: "var(--dash-text)" }}>
              {post.author?.name || "User"}
            </p>
          </div>
        </div>
        <p className="text-xs" style={{ color: "var(--dash-text-muted)" }}>
          {timeAgo(post.createdAt)}
        </p>
      </div>

      {/* Post Image */}
      <img
        src={resolveImageUrl(post.imageUrl)}
        alt={post.caption || "Community post"}
        className="aspect-square w-full object-cover"
        loading="lazy"
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleLike}
            disabled={likePending}
            className="inline-flex items-center text-sm font-medium transition disabled:opacity-50 hover:scale-110"
            style={{ color: liked ? "#ef4444" : "var(--dash-accent)" }}
            aria-label={liked ? "Unlike" : "Like"}
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            onClick={toggleComments}
            className="inline-flex items-center text-sm font-medium transition hover:scale-110"
            style={{ color: "var(--dash-accent)" }}
          >
            <MessageCircle size={18} />
          </button>
          <button
            type="button"
            className="inline-flex items-center text-sm font-medium transition hover:scale-110"
            style={{ color: "var(--dash-accent)" }}
          >
            <Share2 size={18} />
          </button>
        </div>
        <button
          type="button"
          className="inline-flex items-center text-sm font-medium transition hover:scale-110"
          style={{ color: "var(--dash-accent)" }}
        >
          <Bookmark size={18} />
        </button>
      </div>

      {/* Likes Count */}
      <div className="px-3 py-1">
        <p className="text-xs font-semibold" style={{ color: "var(--dash-text)" }}>
          {likeCount} {likeCount === 1 ? "like" : "likes"}
        </p>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="px-3 py-1">
          <p className="text-xs leading-relaxed" style={{ color: "var(--dash-text)" }}>
            <span className="font-semibold">{post.author?.name}</span>{" "}
            <span className="line-clamp-2">{post.caption}</span>
          </p>
        </div>
      )}

      {/* View Comments Link */}
      {commentCount > 0 && (
        <div className="px-3 py-1">
          <button
            type="button"
            onClick={toggleComments}
            className="text-xs font-medium transition"
            style={{ color: "var(--dash-text-muted)" }}
          >
            View all {commentCount} {commentCount === 1 ? "comment" : "comments"}
          </button>
        </div>
      )}

      {/* Comments Section */}
      {commentsOpen && (
        <div className="border-t px-3 py-2" style={{ borderColor: "var(--dash-border)" }}>
          {commentsLoading ? (
            <div className="flex justify-center py-2">
              <Loader2 size={16} className="animate-spin" style={{ color: "var(--dash-accent)" }} />
            </div>
          ) : comments.length === 0 ? (
            <p className="py-2 text-center text-xs" style={{ color: "var(--dash-text-muted)" }}>
              No comments yet
            </p>
          ) : (
            <ul className="mb-2 max-h-40 space-y-1 overflow-y-auto">
              {comments.map((c) => (
                <li key={c.id} className="text-xs">
                  <span className="font-semibold" style={{ color: "var(--dash-text)" }}>
                    {c.author?.name}
                  </span>{" "}
                  <span style={{ color: "var(--dash-text-muted)" }}>{c.text}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Comment Input */}
          <form onSubmit={handleAddComment} className="flex gap-2 border-t pt-2" style={{ borderColor: "var(--dash-border)" }}>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment…"
              className="min-w-0 flex-1 rounded-lg border bg-transparent px-2 py-1 text-xs focus:outline-none focus:ring-1"
              style={{ borderColor: "var(--dash-border)" }}
            />
            <button
              type="submit"
              disabled={commentSubmitting}
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white disabled:opacity-50"
              style={{ backgroundColor: "var(--dash-accent)" }}
              aria-label="Send comment"
            >
              {commentSubmitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
