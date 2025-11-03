// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";
// import Navbar from "./Navbar";
// import { useAuth } from "../context/AuthContext";
// import "./AppStyles.css"

// const MyJobs = ({ onProfileUpdate }) => {
//   const { user, loading } = useAuth();
//   const [jobs, setJobs] = useState([]);
//   const [jobsLoading, setJobsLoading] = useState(true);
//   const [rating, setRating] = useState({}); // track rating input for each job
//   const navigate = useNavigate();

//   // Fetch jobs
//   const fetchJobs = async () => {
//     try {
//       const res = await api.get("/jobs/my");
//       setJobs(res.data);
//     } catch (err) {
//       console.error("Error fetching my jobs:", err);
//     } finally {
//       setJobsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!user) return;
//     fetchJobs();
//   }, [user]);

//   // Rating via input + submit
//   const handleRate = async (assignedJobId) => {
//     try {
//       const ratingVal = rating[assignedJobId];
//       if (!ratingVal || ratingVal < 1 || ratingVal > 5) {
//         return alert("Please enter a rating between 1-5");
//       }

//       await api.post(`/jobs/${assignedJobId}/rate`, { rating: Number(ratingVal) });
//       alert("Rating submitted successfully!");
//       fetchJobs();
//       if (onProfileUpdate) onProfileUpdate();

//       setRating(prev => ({ ...prev, [assignedJobId]: "" }));
//     } catch (err) {
//       console.error(err);
//       alert("Failed to submit rating");
//     }
//   };

//   // Rating via prompt
//   const handleRatePrompt = async (assignedJobId) => {
//     try {
//       const ratingVal = parseFloat(prompt("Enter rating (1-5)"));
//       const review = prompt("Enter review");

//       if (!ratingVal || ratingVal < 1 || ratingVal > 5) {
//         return alert("Invalid rating. Must be between 1 and 5.");
//       }

//       // POST to match backend
//       await api.post(`/jobs/${assignedJobId}/rate`, { rating: ratingVal, review });
//       alert("Job rated successfully!");
//       fetchJobs();
//       if (onProfileUpdate) onProfileUpdate();
//     } catch (err) {
//       console.error("Error rating job:", err);
//       alert(err.response?.data?.message || "Error rating job. Please try again.");
//     }
//   };


//   if (loading || jobsLoading)
//     return <p className="text-center mt-6">Loading your jobs...</p>;

//   return (
//     <div>
//       <Navbar />
//       <div className="my-jobs-container">
//         <h2>My Posted Jobs</h2>
//         {jobs.length === 0 ? (
//           <p>You haven’t posted any jobs yet.</p>
//         ) : (
//           <ul className="my-jobs-list">
//             {jobs.map((job) => (
//               <li key={job._id} className="my-job-card">
//                 <div>
//                   <h3>{job.title}</h3>
//                   <p>{job.description}</p>
//                   <p>
//                     Posted on {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "N/A"}
//                   </p>
//                   <p>
//                     <strong>Status:</strong>{" "}
//                     {job.status === "pending"
//                       ? "Not yet accepted"
//                       : job.status === "accepted"
//                         ? `Accepted by ${job.acceptedBy?.name || "someone"}`
//                         : job.status === "completed"
//                           ? "Completed"
//                           : job.status === "rated"
//                             ? "Rated (Completed)"
//                             : "Unknown"}
//                   </p>
//                 </div>

//                 {/* View Bids Button */}
//                 <div style={{ marginTop: "10px" }}>
//                   <button
//                     className="btn-accept"
//                     onClick={() => navigate(`/jobs/${job._id}/bids`)}
//                   >
//                     View Bids
//                   </button>
//                 </div>

//                 {/* Rating Section */}
//                 <div>
//                   {job.acceptedBy && job.status === "completed" && (
//                     <>
//                       {/* Rate via input + submit */}
//                       <div style={{ marginTop: "8px" }}>
//                         {job.assignedJobId && (
//                           <div style={{ marginTop: "8px" }}>
//                             <input
//                               type="number"
//                               min="1"
//                               max="5"
//                               placeholder="Rate 1-5"
//                               value={rating[job.assignedJobId] || ""}
//                               onChange={(e) =>
//                                 setRating({ ...rating, [job.assignedJobId]: e.target.value })
//                               }
//                               style={{ padding: "4px 6px", width: "60px", marginRight: "8px" }}
//                             />
//                             <button
//                               onClick={() => handleRate(job.assignedJobId)}
//                               style={{
//                                 padding: "6px 12px",
//                                 borderRadius: "6px",
//                                 background: "#7c3aed",
//                                 color: "#fff",
//                                 border: "none",
//                                 cursor: "pointer",
//                               }}
//                             >
//                               Submit
//                             </button>
//                           </div>
//                         )}
//                       </div>

//                       {/* Rate via prompt */}
//                       {job.assignedJobId && (
//                         <button
//                           className="btn-complete"
//                           onClick={() => handleRatePrompt(job.assignedJobId)}
//                           style={{ marginTop: "8px", marginLeft: "8px" }}
//                         >
//                           Rate Work (Prompt)
//                         </button>
//                       )}
//                     </>
//                   )}
//                 </div>
//               </li>

//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyJobs;

// src/pages/MyJobs.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import { FaStar } from "react-icons/fa";
import "./AppStyles.css";
import RatingComponent from "../components/RatingComponent"; // adjust path if needed

const MyJobs = ({ onProfileUpdate }) => {
  const { user, loading } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [ratingData, setRatingData] = useState({}); // track stars and comment for each job
  const navigate = useNavigate();

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs/my");
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching my jobs:", err);
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchJobs();
  }, [user]);

  // Handle Rating Submit
  const handleRatingSubmit = async (assignedJobId) => {
    const { stars, comment } = ratingData[assignedJobId] || {};
    if (!stars || stars < 1) {
      alert("Please select a star rating before submitting!");
      return;
    }

    try {
      await api.post(`/jobs/${assignedJobId}/rate`, { rating: stars, review: comment });
      alert("Thank you for your feedback!");
      fetchJobs();
      if (onProfileUpdate) onProfileUpdate();
      setRatingData((prev) => ({ ...prev, [assignedJobId]: { stars: 0, comment: "" } }));
    } catch (err) {
      console.error("Error submitting rating:", err);
      alert("Failed to submit rating. Please try again.");
    }
  };
  
  if (loading || jobsLoading)
    return <p className="text-center mt-6">Loading your jobs...</p>;

  return (
    <div>
      <Navbar />
      <div className="my-jobs-container">
        <h2>My Posted Jobs</h2>
        {jobs.length === 0 ? (
          <p>You haven’t posted any jobs yet.</p>
        ) : (
          <ul className="my-jobs-list">
            {jobs.map((job) => (
              <li key={job._id} className="my-job-card">
                <div>
                  <h3>{job.title}</h3>
                  <p>{job.description}</p>
                  <p>
                    Posted on{" "}
                    {job.createdAt
                      ? new Date(job.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {job.status === "pending"
                      ? "Not yet accepted"
                      : job.status === "accepted"
                      ? `Accepted by ${job.acceptedBy?.name || "someone"}`
                      : job.status === "completed"
                      ? "Completed"
                      : job.status === "rated"
                      ? "Rated (Completed)"
                      : "Unknown"}
                  </p>
                </div>

                {/* View Bids Button */}
                <div style={{ marginTop: "10px" }}>
                  <button
                    className="btn-accept"
                    onClick={() => navigate(`/jobs/${job._id}/bids`)}
                  >
                    View Bids
                  </button>
                </div>

                {/* Professional Rating Section */}
                {job.acceptedBy && job.status === "completed" && (
                  <div className="rating-card">
                    <h4 className="rating-header">⭐ Rate Completed Work</h4>
                    <div className="stars-wrapper">
                      {[...Array(5)].map((_, i) => {
                        const ratingValue = i + 1;
                        return (
                          <FaStar
                            key={ratingValue}
                            className="star-icon"
                            size={28}
                            color={
                              ratingValue <= (ratingData[job.assignedJobId]?.hover || ratingData[job.assignedJobId]?.stars)
                                ? "#facc15"
                                : "#e5e7eb"
                            }
                            onClick={() =>
                              setRatingData((prev) => ({
                                ...prev,
                                [job.assignedJobId]: {
                                  ...prev[job.assignedJobId],
                                  stars: ratingValue,
                                },
                              }))
                            }
                            onMouseEnter={() =>
                              setRatingData((prev) => ({
                                ...prev,
                                [job.assignedJobId]: {
                                  ...prev[job.assignedJobId],
                                  hover: ratingValue,
                                },
                              }))
                            }
                            onMouseLeave={() =>
                              setRatingData((prev) => ({
                                ...prev,
                                [job.assignedJobId]: {
                                  ...prev[job.assignedJobId],
                                  hover: null,
                                },
                              }))
                            }
                          />
                        );
                      })}
                    </div>

                    <textarea
                      className="rating-textarea"
                      placeholder="Write a short review..."
                      value={ratingData[job.assignedJobId]?.comment || ""}
                      onChange={(e) =>
                        setRatingData((prev) => ({
                          ...prev,
                          [job.assignedJobId]: {
                            ...prev[job.assignedJobId],
                            comment: e.target.value,
                          },
                        }))
                      }
                    />

                    <button
                      className="rating-btn"
                      onClick={() => handleRatingSubmit(job.assignedJobId)}
                    >
                      Submit Rating
                    </button>
                  </div>
                )}
              </li>

            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
