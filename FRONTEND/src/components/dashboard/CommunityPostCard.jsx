import { useEffect, useState } from "react";
import { Heart, MessageCircle, Loader2, Send } from "lucide-react";
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
      className="overflow-hidden rounded-xl border shadow-sm transition hover:shadow-md"
      style={{ borderColor: "var(--dash-border)", backgroundColor: "var(--dash-surface)" }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <Avatar name={post.author?.name} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold" style={{ color: "var(--dash-text)" }}>
            {post.author?.name || "User"}
          </p>
          <p className="text-xs" style={{ color: "var(--dash-text-muted)" }}>
            {timeAgo(post.createdAt)}
          </p>
        </div>
      </div>

      <img
        src={resolveImageUrl(post.imageUrl)}
        alt={post.caption || "Community post"}
        className="aspect-square w-full object-cover"
        loading="lazy"
      />

      <div className="px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleLike}
            disabled={likePending}
            className="inline-flex items-center gap-1.5 text-sm font-medium transition disabled:opacity-50"
            style={{ color: liked ? "var(--dash-accent-hover)" : "var(--dash-accent)" }}
            aria-label={liked ? "Unlike" : "Like"}
          >
            <Heart size={20} fill={liked ? "currentColor" : "none"} className="transition-transform active:scale-125" />
            {likeCount}
          </button>
          <button
            type="button"
            onClick={toggleComments}
            className="inline-flex items-center gap-1.5 text-sm font-medium"
            style={{ color: "var(--dash-accent)" }}
          >
            <MessageCircle size={20} />
            {commentCount}
          </button>
        </div>

        {post.caption && (
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--dash-text)" }}>
            <span className="font-semibold">{post.author?.name}</span>{" "}
            {post.caption}
          </p>
        )}

        {commentsOpen && (
          <div className="mt-4 border-t pt-4" style={{ borderColor: "var(--dash-border)" }}>
            {commentsLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 size={20} className="animate-spin" style={{ color: "var(--dash-accent)" }} />
              </div>
            ) : comments.length === 0 ? (
              <p className="py-2 text-center text-xs" style={{ color: "var(--dash-text-muted)" }}>
                No comments yet — be the first.
              </p>
            ) : (
              <ul className="mb-3 max-h-48 space-y-2 overflow-y-auto">
                {comments.map((c) => (
                  <li key={c.id} className="text-sm">
                    <span className="font-semibold" style={{ color: "var(--dash-text)" }}>
                      {c.author?.name}
                    </span>{" "}
                    <span style={{ color: "var(--dash-text-muted)" }}>{c.text}</span>
                    <span className="ml-2 text-xs" style={{ color: "var(--dash-text-muted)" }}>
                      {timeAgo(c.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment…"
                className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: "var(--dash-border)" }}
              />
              <button
                type="submit"
                disabled={commentSubmitting}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white disabled:opacity-50"
                style={{ backgroundColor: "var(--dash-accent)" }}
                aria-label="Send comment"
              >
                {commentSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
}
