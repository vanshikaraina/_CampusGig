// // src/pages/AcceptedJobs.jsx
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";
// import "./AppStyles.css";

// export default function AcceptedJobs() {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Open chat for a specific job and user
//   const openChat = (posterId, jobId, acceptedUserId, posterName) => {
//     if (!acceptedUserId) {
//       alert("Cannot open chat: Accepted user not found");
//       return;
//     }

//     // Navigate to the chat page with all required info
//     navigate(`/chat/${posterId}/${jobId}/${acceptedUserId}`, {
//       state: { posterName }
//     });

//   };

//   useEffect(() => {
//     const fetchAcceptedJobs = async () => {
//       try {
//         const res = await api.get("/jobs/accepted");
//         setJobs(res.data);
//       } catch (err) {
//         console.error("Error fetching accepted jobs:", err.response?.data || err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAcceptedJobs();
//   }, []);

//   if (loading) {
//     return <p>Loading your accepted jobs...</p>;
//   }

//   return (
//     <div className="jobs-list">
//       <h2>My Accepted Jobs</h2>
//       {jobs.length === 0 ? (
//         <p>You haven’t accepted any jobs yet.</p>
//       ) : (
//         <ul>
//           {jobs.map((jobItem) => {
//             const job = jobItem.job || {};
//             const postedBy = job.postedBy || {};
//             const student = jobItem.student || {};
//             return (
//               <li key={jobItem._id} className="job-card">
//                 <h3>{job.title}</h3>
//                 <p>{job.description || "No description available"}</p>
//                 <p><strong>Category:</strong> {job.category || "N/A"}</p>
//                 <p><strong>Pay:</strong> ₹{job.price || "N/A"}</p>
//                 <p>
//                   <strong>Deadline:</strong>{" "}
//                   {job.deadline ? new Date(job.deadline).toLocaleDateString() : "No deadline"}
//                 </p>
//                 <p><strong>Posted by:</strong> {postedBy.name || "Unknown"}</p>
//                 <p><strong>Status:</strong> <span style={{ color: "green" }}>{jobItem.status}</span></p>

//                 <button
//                   className="chat-btn"
//                   onClick={() => openChat(postedBy._id, jobItem._id, student._id, postedBy.name)}
//                 >
//                   Chat
//                 </button>
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </div>
//   );
// }


// src/pages/AcceptedJobs.jsximport { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AppStyles.css";

export default function AcceptedJobs({ onUserUpdate }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const openChat = (posterId, jobId, acceptedUserId, posterName) => {
    if (!acceptedUserId) {
      alert("Cannot open chat: Accepted user not found");
      return;
    }

    navigate(`/chat/${posterId}/${jobId}/${acceptedUserId}`, {
      state: { posterName },
    });
  };

  const fetchAcceptedJobs = async () => {
    try {
      const res = await api.get("/jobs/accepted");
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching accepted jobs:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = async (id) => {
    try {
      await api.put(`/jobs/${id}/complete`);
      fetchAcceptedJobs(); // refresh jobs list

      // refresh profile stats
      if (onUserUpdate) {
        const res = await api.get("/auth/me", { withCredentials: true });
        onUserUpdate(res.data.user);
      }
    } catch (err) {
      console.error("Error marking job completed:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchAcceptedJobs();
  }, []);

  if (loading) return <p>Loading your accepted jobs...</p>;

  const acceptedJobs = jobs.filter(j => j.status === "accepted");
  const completedJobs = jobs.filter(j => j.status === "completed");

  return (
    <div className="jobs-list">
      <h2>My Accepted Jobs</h2>
      {acceptedJobs.length === 0 ? (
        <p>You haven’t accepted any jobs yet.</p>
      ) : (
        <ul>
          {acceptedJobs.map((jobItem) => {
            const job = jobItem.job || {};
            const postedBy = job.postedBy || {};
            const student = jobItem.student || {};
            return (
              <li key={jobItem._id} className="job-card">
                <h3>{job.title}</h3>
                <p>{job.description || "No description available"}</p>
                <p><strong>Category:</strong> {job.category || "N/A"}</p>
                <p><strong>Pay:</strong> ₹{job.price || "N/A"}</p>
                <p><strong>Deadline:</strong> {job.deadline ? new Date(job.deadline).toLocaleDateString() : "No deadline"}</p>
                <p><strong>Posted by:</strong> {postedBy.name || "Unknown"}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span style={{ color: "#FFA500", fontWeight: "bold" }}>{jobItem.status}</span>
                </p>

                <div className="job-buttons">
                  <button className="btn-complete" onClick={() => markCompleted(jobItem._id)}>
                    Mark as Completed
                  </button>
                  <button
                    className="chat-btn"
                    onClick={() => openChat(postedBy._id, jobItem._id, student._id, postedBy.name)}
                  >
                    Chat
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <h2 style={{ marginTop: "2rem" }}>My Completed Jobs</h2>
      {completedJobs.length === 0 ? (
        <p>No jobs completed yet.</p>
      ) : (
        <ul>
          {completedJobs.map((jobItem) => {
            const job = jobItem.job || {};
            const postedBy = job.postedBy || {};
            return (
              <li key={jobItem._id} className="job-card">
                <h3>{job.title}</h3>
                <p>{job.description || "No description available"}</p>
                <p><strong>Category:</strong> {job.category || "N/A"}</p>
                <p><strong>Pay:</strong> ₹{job.price || "N/A"}</p>
                <p><strong>Deadline:</strong> {job.deadline ? new Date(job.deadline).toLocaleDateString() : "No deadline"}</p>
                <p><strong>Posted by:</strong> {postedBy.name || "Unknown"}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span style={{ color: "#28a745", fontWeight: "bold" }}>{jobItem.status}</span>
                </p>

                <div className="job-buttons">
                  <button
                    className="chat-btn"
                    onClick={() => openChat(postedBy._id, jobItem._id, jobItem.student?._id, postedBy.name)}
                  >
                    Chat
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
