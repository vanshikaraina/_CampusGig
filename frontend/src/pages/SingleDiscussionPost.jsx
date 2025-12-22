// pages/SingleDiscussionPost.jsx

// src/pages/SingleDiscussionPost.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { getDiscussionById, addReplyToDiscussion } from "../services/discussionApi";
import { useAuth } from "../context/AuthContext";
import "./AppStyles.css";

export default function SingleDiscussionPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [reply, setReply] = useState("");
  const [loadingPost, setLoadingPost] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchPost = async () => {
    try {
      setLoadingPost(true);
      const res = await getDiscussionById(id);
      setPost(res.data);
    } catch (err) {
      console.error("Failed to fetch post:", err);
    } finally {
      setLoadingPost(false);
    }
  };

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // clicking a tag from single-post should return to board and apply that tag
  // we pass the tag in navigation state (fromTag) so discussion board reads it
  const handleTagClick = (tag) => {
    // navigate to the board route (root path assumed) and pass tag in state
    navigate("/", { replace: false, state: { fromTag: tag } });
    // also update URL so shareable:
    const base = "/";
    const newUrl = `${base}?tag=${encodeURIComponent(tag)}`;
    window.history.replaceState({}, "", newUrl);
  };

  const submitReply = async () => {
    if (!user) return alert("Login required to reply.");
    if (!reply.trim()) return;

    try {
      setSubmitting(true);
      await addReplyToDiscussion(id, { text: reply.trim() });
      setReply("");
      await fetchPost();
    } catch (err) {
      console.error("Failed to submit reply:", err);
      alert("Could not post reply. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingPost || !post) return <p className="loading">Loading post...</p>;

  return (
    <div className="single-container">
      <div className="single-card">
        <h2>{post.title}</h2>
        <p className="single-content">{post.content}</p>

        <div className="tag-container">
          {post.tags?.map((tag, i) => (
            <span
              key={i}
              className="tag"
              onClick={() => handleTagClick(tag)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter") handleTagClick(tag); }}
            >
              #{tag}
            </span>
          ))}
        </div>

        <p className="posted-by">Posted by 👤 {post.author?.name || "Unknown"}</p>
      </div>

      <h3 className="replies-title">💬 Replies</h3>

      <div className="reply-list">
        {post.comments?.length ? (
          post.comments.map((r, index) => (
            <div key={r._id || index} className="reply-card">
              <p>{r.text}</p>
              <small className="reply-user">
                👤 {r.user?.name || "User"} • {formatDistanceToNow(new Date(r.createdAt))} ago
              </small>
            </div>
          ))
        ) : (
          <p className="no-replies">No replies yet — be the first to respond!</p>
        )}
      </div>

      <textarea
        className="textarea-field"
        placeholder="Write your reply..."
        value={reply}
        onChange={e => setReply(e.target.value)}
      />
      <button className="post-btn" onClick={submitReply} disabled={submitting}>
        {submitting ? "Posting..." : "Reply"}
      </button>
    </div>
  );
}