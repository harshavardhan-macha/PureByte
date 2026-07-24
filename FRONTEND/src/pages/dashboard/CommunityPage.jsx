import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Users, Loader2, Sparkles } from "lucide-react";
import CommunityPostCard from "../../components/dashboard/CommunityPostCard";
import CreatePostModal from "../../components/dashboard/CreatePostModal";
import {
  getCommunityPosts,
  createCommunityPost,
  uploadImageToCloudinary,
  getApiErrorMessage,
} from "../../lib/communityApi";
import { showError, showSuccess } from "../../lib/toast";

function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-xl border"
          style={{ borderColor: "var(--dash-border)", backgroundColor: "var(--dash-surface)" }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="h-9 w-9 rounded-full bg-emerald-100" />
            <div className="space-y-2">
              <div className="h-3 w-24 rounded bg-emerald-100" />
              <div className="h-2 w-16 rounded bg-emerald-50" />
            </div>
          </div>
          <div className="aspect-square bg-emerald-50" />
          <div className="space-y-2 px-4 py-3">
            <div className="h-3 w-20 rounded bg-emerald-100" />
            <div className="h-3 w-full rounded bg-emerald-50" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [draftHasContent, setDraftHasContent] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getCommunityPosts();
      setPosts(data.items || []);
    } catch (err) {
      const message = getApiErrorMessage(err, "Couldn't load community posts — try again");
      setError(message);
      // Non-401 errors stay on page — interceptors only logout on 401
      if (err.response?.status !== 401) {
        showError(message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleCreatePost = async (file, caption) => {
    setSubmitting(true);
    try {
      let imageInput = file;
      const useCloudinary = Boolean(
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME && import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      );

      if (useCloudinary && file instanceof File) {
        imageInput = await uploadImageToCloudinary(file);
      }

      const { data } = await createCommunityPost(imageInput, caption);
      setPosts((prev) => [data, ...prev]);
      setComposerOpen(false);
      setDraftHasContent(false);
      showSuccess("Post shared");
    } catch (err) {
      showError(getApiErrorMessage(err, "Could not share post. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeUpdate = (postId, data) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likeCount: data.likeCount, likedByMe: data.likedByMe }
          : p,
      ),
    );
  };

  const feedSummary = useMemo(() => {
    if (!posts.length) return "Be the first to share a product photo.";
    return `${posts.length} community update${posts.length === 1 ? "" : "s"} ready to explore.`;
  }, [posts.length]);

  return (
    <div>
      <div className="page-card p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--dash-text)" }}>
              Community
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--dash-text-muted)" }}>
              Share product photos and ingredient safety tips.
            </p>
            <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-1 text-xs font-medium" style={{ color: "var(--dash-text-muted)" }}>
              <Sparkles size={14} style={{ color: "var(--dash-accent)" }} />
              {feedSummary}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setComposerOpen(true)}
            className="btn-primary shrink-0"
          >
            <Plus size={18} />
            Create post
          </button>
        </div>
      </div>

      {error && !loading && (
        <div className="mt-6 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] px-4 py-4 text-sm">
          <p className="font-medium" style={{ color: "var(--dash-text)" }}>Couldn't load community posts</p>
          <p className="mt-1" style={{ color: "var(--dash-text-muted)" }}>{error}</p>
          <button
            type="button"
            onClick={loadPosts}
            className="mt-3 text-sm font-semibold underline"
            style={{ color: "var(--dash-accent)" }}
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="mt-6">
          <FeedSkeleton />
        </div>
      ) : !error && posts.length === 0 ? (
        <div
          className="mt-6 flex flex-col items-center rounded-2xl border border-dashed px-6 py-14 text-center"
          style={{ borderColor: "var(--dash-border)", backgroundColor: "var(--dash-surface)" }}
        >
          <Users size={32} style={{ color: "var(--dash-accent)", opacity: 0.5 }} />
          <p className="mt-3 font-medium" style={{ color: "var(--dash-text)" }}>
            No posts yet
          </p>
          <p className="mt-1 max-w-sm text-sm" style={{ color: "var(--dash-text-muted)" }}>
            Be the first to share a product photo and help others make safer choices.
          </p>
          <button
            type="button"
            onClick={() => setComposerOpen(true)}
            className="btn-primary mt-5"
          >
            <Plus size={16} />
            Create the first post
          </button>
        </div>
      ) : (
        !error && (
          <div className="mt-6 space-y-4">
            {posts.map((post) => (
              <CommunityPostCard key={post.id} post={post} onLikeUpdate={handleLikeUpdate} />
            ))}
          </div>
        )
      )}

      <CreatePostModal
        open={composerOpen}
        onClose={() => {
          setComposerOpen(false);
          setDraftHasContent(false);
        }}
        onSubmit={handleCreatePost}
        submitting={submitting}
        draftHasContent={draftHasContent}
        onDraftChange={setDraftHasContent}
      />
    </div>
  );
}
