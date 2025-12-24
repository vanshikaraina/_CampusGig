import { useState } from "react";
import { completePayment } from "../services/jobs";

export default function CompletePaymentButton({ jobId }) {
  const [payoutRef, setPayoutRef] = useState("");
  const [loading, setLoading] = useState(false);

  const onComplete = async () => {
    try {
      setLoading(true);
      await completePayment(jobId, payoutRef);
      alert("Payment released successfully");
      setPayoutRef("");
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || "Failed to release payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input
        placeholder="Payout reference (UTR / note)"
        value={payoutRef}
        onChange={(e) => setPayoutRef(e.target.value)}
      />
      <button onClick={onComplete} disabled={loading || !payoutRef}>
        {loading ? "Releasing…" : "Complete & Release"}
      </button>
    </div>
  );
}
