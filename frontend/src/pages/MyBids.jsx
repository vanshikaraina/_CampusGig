//MyBids.jsx

import { useEffect, useState } from "react";
import api from "../services/api";
import "./MyBids.css";

export default function MyBids() {
  const [bids, setBids] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    async function fetchBids() {
      try {
        const { data } = await api.get("/jobs/my-bids");
        setBids(data.bids);
        setTotalEarnings(data.totalEarnings);
      } catch (err) {
        console.error(err);
      }
    }
    fetchBids();
  }, []);

  return (
    <div className="my-bids-container">
      <h2>📋 My Bids</h2>
      <h3>Total Earnings: ₹{totalEarnings}</h3>

      {bids.length === 0 ? (
        <p>No bids yet.</p>
      ) : (
        <div className="bids-list">
          {bids.map((b) => (
            <div className="bid-card" key={b._id}>
              <h4>{b.job?.title}</h4>
              <p><strong>Poster:</strong> {b.job?.postedBy?.name || "Unknown"}</p>
              <p><strong>Bid Amount:</strong> ₹{b.bidAmount}</p>
              <p className={`status ${b.status}`}>Status: {b.status || "pending"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}