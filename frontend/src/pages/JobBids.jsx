// src/pages/JobBids.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AppStyles.css";

export default function JobBids() {
  const { jobId } = useParams();
  const [bids, setBids] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch job details + bids
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const jobRes = await api.get(`/jobs/my`); // get all my jobs
        const currentJob = jobRes.data.find((j) => j._id === jobId);
        setJob(currentJob);

        const res = await api.get(`/jobs/${jobId}/bids`);
        setBids(res.data);
      } catch (err) {
        console.error("Error fetching bids:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, [jobId]);

  const handleSelectBid = async (bidId) => {
    try {
      await api.put(`/jobs/${jobId}/select/${bidId}`);
      alert("Bid selected! The job has been assigned.");
      navigate("/my-jobs"); // redirect back to poster’s job list
    } catch (err) {
      console.error("Error selecting bid:", err.response?.data || err.message);
      alert(
        `Failed to select bid: ${err.response?.data?.message || err.message}`
      );
    }
  };

  if (loading) return <p>Loading bids...</p>;

  return (
    <div className="jobs-list">
      <h2>Job Bids</h2>

      {job && (
        <div className="job-card">
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <p>
            <strong>Budget:</strong> ₹{job.price}
          </p>
          <p>
            <strong>Deadline:</strong>{" "}
            {job.deadline
              ? new Date(job.deadline).toLocaleDateString()
              : "No deadline"}
          </p>
        </div>
      )}

      <h3 style={{ marginTop: "1.5rem" }}>Bids</h3>
      {bids.length === 0 ? (
        <p>No bids yet for this job.</p>
      ) : (
        <ul>
          {bids.map((bid) => (
            <li key={bid._id} className="job-card">
              <p>
                <strong>Student:</strong> {bid.student?.name} (
                {bid.student?.email})
              </p>
              <p>
                <strong>Bid Amount:</strong> ₹{bid.bidAmount}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {bid.status === "pending" ? "⏳ Pending" : bid.status}
              </p>

              <div className="job-buttons">
                {/* View Portfolio Button */}
                <button
                  className="btn-portfolio"
                  onClick={() => navigate(`/portfolio/${bid.student?._id}`)}
                >
                  View Portfolio
                </button>

                {/* ✅ Updated Bid Actions */}
                {job?.acceptedBy ? (
                  <>
                    {bid.status === "accepted" && (
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        ✅ Selected
                      </span>
                    )}
                    {bid.status === "pending" && (
                      <span style={{ color: "gray", fontWeight: "bold" }}>
                        ❌ Not Selected
                      </span>
                    )}
                    {bid.status === "rejected" && (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        ❌ Rejected
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    {bid.status === "pending" && (
                      <button
                        className="btn-accept"
                        onClick={() => handleSelectBid(bid._id)}
                      >
                        Select This Bid
                      </button>
                    )}
                    {bid.status === "accepted" && (
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        ✅ Selected
                      </span>
                    )}
                    {bid.status === "rejected" && (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        ❌ Rejected
                      </span>
                    )}
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}