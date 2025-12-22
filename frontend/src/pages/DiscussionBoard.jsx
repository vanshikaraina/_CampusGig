import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getAllDiscussions, createDiscussion } from "../services/discussionApi";
import { useAuth } from "../context/AuthContext";
import "./AppStyles.css";

export default function DiscussionBoard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [discussions, setDiscussions] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const mountedRef = useRef(true);

  const buildQuery = (p = 1) => {
    let q = `?page=${p}&limit=10`;
    if (selectedTag) q += `&tag=${encodeURIComponent(selectedTag)}`;
    return q;
  };

  const fetchDiscussions = useCallback(
    async (pageNum = 1, reset = false) => {
      try {
        setLoading(true);
        const res = await getAllDiscussions(buildQuery(pageNum));
        const list = res.data.discussions || [];

        if (!mountedRef.current) return;

        if (reset) {
          setDiscussions(list);
        } else {
          setDiscussions((prev) => {
            const ids = new Set(prev.map((p) => p._id));
            const merged = [...prev];
            list.forEach((item) => {
              if (!ids.has(item._id)) merged.push(item);
            });
            return merged;
          });
        }

        setPage(res.data.page || pageNum);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Failed fetching discussions:", err);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [selectedTag]
  );

  useEffect(() => {
    const tagFromState = location?.state?.fromTag;
    if (tagFromState) {
      navigate(location.pathname + location.search, {
        replace: true,
        state: null,
      });
      if (tagFromState !== selectedTag) {
        setSelectedTag(tagFromState);
      }
      return;
    }

    const params = new URLSearchParams(location.search);
    const tagFromURL = params.get("tag") || "";

    if (tagFromURL !== selectedTag) {
      setSelectedTag(tagFromURL);
    }
  }, [location.search, location.state]);

  useEffect(() => {
    setDiscussions([]);
    setPage(1);
    fetchDiscussions(1, true);
  }, [selectedTag, fetchDiscussions]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const handler = () => {
      if (loading) return;
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500;
      if (nearBottom && page < totalPages) {
        fetchDiscussions(page + 1, false);
      }
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [loading, page, totalPages, fetchDiscussions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to post a discussion.");
    if (!title.trim() || !content.trim())
      return alert("Title and content are required.");

    try {
      const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
      const res = await createDiscussion({
        title: title.trim(),
        content: content.trim(),
        tags: tagList,
      });
      setDiscussions((prev) => [res.data, ...prev]);
      setTitle("");
      setContent("");
      setTags("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Failed to create discussion:", err);
      alert("Could not post discussion. Try again.");
    }
  };

  const handleTagClick = (tag) => {
    if (selectedTag === tag) {
      setSelectedTag("");
      const base = window.location.pathname;
      window.history.replaceState({}, "", base);
    } else {
      setSelectedTag(tag);
      const base = window.location.pathname;
      const newUrl = `${base}?tag=${encodeURIComponent(tag)}`;
      window.history.replaceState({}, "", newUrl);
    }

    setDiscussions([]);
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -------------------- RETURN FIXED --------------------
  return (
    <div className="discussion-container">
      <h2 className="discussion-title">Campus Gig Discussion Board 💬</h2>

      {/* ----------- DISCUSSION LIST FIRST ----------- */}
      {selectedTag && (
        <div className="selected-tag-banner">
          Showing discussions tagged: <strong>#{selectedTag}</strong>
          <button
            className="clear-tag-btn"
            onClick={() => {
              setSelectedTag("");
              const base = window.location.pathname;
              window.history.replaceState({}, "", base);
              setDiscussions([]);
              setPage(1);
            }}
          >
            Clear
          </button>
        </div>
      )}

      {loading && page === 1 && (
        <Skeleton count={4} height={110} style={{ marginBottom: "12px" }} />
      )}

      {(!discussions || discussions.length === 0) && !loading ? (
        <p className="no-posts">No discussions yet. Start the conversation!</p>
      ) : (
        <div className="discussion-list">
          {discussions.map((d) => (
            <div
              key={d._id}
              className="discussion-card"
              onClick={() => navigate(`/discussion/${d._id}`)}
            >
              <h3 className="discussion-card-title">{d.title}</h3>
              <p className="discussion-card-content">
                {d.content && d.content.length > 140
                  ? d.content.substring(0, 140) + "..."
                  : d.content}
              </p>

              <div className="tag-container">
                {d.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className={`tag ${
                      selectedTag === tag ? "tag-selected" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTagClick(tag);
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="meta-info">
                <span>👤 {d.author?.name || "Unknown User"}</span>
                <span>
                  💬{" "}
                  {Array.isArray(d.comments)
                    ? d.comments.length
                    : d.commentsCount ?? 0}{" "}
                  replies
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && page > 1 && (
        <p className="loading-more">Loading more discussions...</p>
      )}

      <hr className="divider" />

      {/* ----------- NEW DISCUSSION FORM AT BOTTOM ----------- */}
      <div className="discussion-form-card">
        <h3 className="section-title">📝 Start a New Discussion</h3>
        <form onSubmit={handleSubmit} className="discussion-form" autoComplete="off">
          <input
            type="text"
            placeholder="Post Title"
            className="input-field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Write your question or topic..."
            className="textarea-field"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            className="input-field"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <button className="post-btn" type="submit">
            Post Discussion
          </button>
        </form>
      </div>
    </div>
  );
}