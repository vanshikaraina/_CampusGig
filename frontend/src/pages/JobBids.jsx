// src/pages/JobBids.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { selectWinningBid, completePayment } from "../services/jobs"; // ✅ added payment helpers
import "./AppStyles.css";
import axios from "axios";

export default function JobBids() {
  const { jobId } = useParams();
  const [bids, setBids] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [payoutRef, setPayoutRef] = useState("");
  const navigate = useNavigate();

  // Fetch job details + bids (keep original logic)
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const jobRes = await api.get(`/jobs/my`);
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

  // ✅ Razorpay + select bid + pay
  const handleSelectBid = async (bidId) => {
    try {
      await selectWinningBid(jobId, bidId); // just mark as accepted
      const res = await api.get(`/jobs/${jobId}`);
      setJob(res.data);
      const bidsRes = await api.get(`/jobs/${jobId}/bids`);
      setBids(bidsRes.data);
      alert("Bid selected successfully!");
    } catch (err) {
      console.error("Error selecting bid:", err?.response?.data || err.message);
      alert(err?.response?.data?.message || err.message || "Failed to select bid");
    }
  };

  const handlePayNow = async (bidId) => {
    try {
      setPaying(true);
      const { data } = await axios.post(
  `http://localhost:5000/api/payment/jobs/${jobId}/create-payment`,
  { bidId },
  { withCredentials: true }   // ✅ include cookies for auth
);

      const { payment } = data;

      if (!payment) {
        alert("Payment order was not created.");
        return;
      }

      const rzp = new window.Razorpay({
        key: payment.keyId,
        order_id: payment.orderId,
        amount: payment.amount,
        currency: payment.currency || "INR",
        name: "CampusGig",
        description: "Escrow charge to job poster",
        handler: async () => {
          alert("Payment initiated. Awaiting confirmation…");
          const res = await api.get(`/jobs/${jobId}`);
          setJob(res.data);
          const bidsRes = await api.get(`/jobs/${jobId}/bids`);
          setBids(bidsRes.data);
        },
        theme: { color: "#2563eb" },
      });

      rzp.on("payment.failed", (resp) => {
        console.error("Payment failed:", resp);
        alert(`Payment Failed: ${resp.error?.description || "Unknown reason"}`);
      });

      rzp.open();
    } catch (err) {
      console.error("Error starting payment:", err);
      alert(err?.response?.data?.message || err.message || "Failed to start payment");
    } finally {
      setPaying(false);
    }
  };


  // ✅ Complete and release payment (optional)
  const handleCompleteAndRelease = async () => {
    try {
      if (!payoutRef.trim()) {
        if (!confirm("No payout reference entered. Proceed anyway?")) return;
      }
      await completePayment(jobId, payoutRef.trim());
      setPayoutRef("");
      const res = await api.get(`/jobs/${jobId}`);
      setJob(res.data);
      alert("Job marked completed & payout recorded");
    } catch (err) {
      console.error("Complete-payment error:", err?.response?.data || err.message);
      alert(err?.response?.data?.message || err.message || "Failed to complete");
    }
  };

  if (loading) return <p>Loading bids...</p>;

  const isPaid = job?.payment?.status === "PAID";
  const isCompleted = job?.status === "COMPLETED";

  return (
    <div className="jobs-list">
      <h2>Job Bids</h2>

      {job && (
        <div className="job-card">
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <p><strong>Budget:</strong> ₹{job.price}</p>
          <p>
            <strong>Deadline:</strong>{" "}
            {job.deadline
              ? new Date(job.deadline).toLocaleDateString()
              : "No deadline"}
          </p>
          <p>
            <strong>Status:</strong> {job.status}
          </p>
          <p>
            <strong>Payment:</strong>{" "}
            {job.payment?.status || "NONE"}{" "}
            {job.payment?.heldAmount
              ? `(₹${(job.payment.heldAmount / 100).toFixed(2)})`
              : ""}
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
                <button
                  className="btn-portfolio"
                  onClick={() => navigate(`/portfolio/${bid.student?._id}`)}
                >
                  View Portfolio
                </button>

                {/* Show Select Bid button only if not accepted/rejected */}
                {/* Select Bid button for pending bids */}
                {bid.status === "pending" && !isPaid && (
                  <button
                    className="btn-accept"
                    disabled={paying}
                    onClick={() => handleSelectBid(bid._id)}
                  >
                    {paying ? "Processing…" : "Select Bid"}
                  </button>
                )}

                {/* Pay Now button only for accepted bids */}
                {bid.status === "accepted" && !isPaid && (
                  <button
                    className="btn-accept"
                    disabled={paying}
                    onClick={() => handlePayNow(bid._id)}
                  >
                    {paying ? "Processing…" : "Pay Now"}
                  </button>
                )}


                {bid.status === "accepted" && isPaid && (
                  <span style={{ color: "green", fontWeight: "bold", marginLeft: 12 }}>
                    ✅ Selected (paid)
                  </span>
                )}
                {bid.status === "rejected" && (
                  <span style={{ color: "red", fontWeight: "bold" }}>❌ Rejected</span>
                )}
              </div>

            </li>
          ))}
        </ul>
      )}

      {/* ✅ Release payout section (after payment captured) */}
      {isPaid && !isCompleted && (
        <>
          <h3 style={{ marginTop: "1.5rem" }}>Release payout</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              placeholder="Payout reference (UTR / note)"
              value={payoutRef}
              onChange={(e) => setPayoutRef(e.target.value)}
            />
            <button className="btn-primary" onClick={handleCompleteAndRelease}>
              Complete & Release
            </button>
          </div>
        </>
      )}

      {isCompleted && (
        <div style={{ marginTop: "1rem", color: "green", fontWeight: "bold" }}>
          ✅ Job completed & payout recorded
        </div>
      )}
    </div>
  );
}
