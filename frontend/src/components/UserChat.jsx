import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import "./UserChat.css";

export default function UserChat({ currentUserId }) {
  const { posterId, jobId, acceptedUserId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get posterName from navigation state
  const { posterName } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef(null); // For auto-scroll

  // Fetch chat messages
  useEffect(() => {
    if (!acceptedUserId || !posterId || !jobId) {
      return <p>Chat cannot be loaded. Missing required data.</p>;
    }
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/${posterId}/${jobId}/${acceptedUserId}`);
        setMessages(res.data);
      } catch (err) {
        if (err.response && err.response.status === 404) setMessages([]);
        else console.error("Error fetching chat:", err);
      }
    };

    fetchMessages();

    // Optional: Polling for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [posterId, acceptedUserId, jobId]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

const handleSend = async () => {
  if (!newMsg.trim()) return;
  console.log({ posterId, acceptedUserId, jobId, currentUserId });

  if (!posterId || !acceptedUserId || !jobId || !currentUserId) {
    return alert("Cannot send message: missing required info.");
  }

  try {
    const res = await api.post("/chat", {
      posterId: posterId.toString(),
      acceptedUserId: acceptedUserId.toString(),
      jobId: jobId.toString(),
      senderId: currentUserId.toString(),
      text: newMsg.trim(),
    });
    setMessages(res.data);
    setNewMsg("");
  } catch (err) {
    console.error("Error sending message:", err);
    alert(err.response?.data?.message || "Failed to send message");
  }
};


  return (
    <div className="user-chat">
      {/* Header */}
      <div className="chat-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        Chat with {posterName || (acceptedUserId === currentUserId ? posterId : acceptedUserId)}
      </div>

      {/* <div className="chat-header"a>
        Chat with {posterName || (acceptedUserId === currentUserId ? posterId : acceptedUserId)} */}
        {/* <button onClick={() => navigate(-1)}>X</button> */}
      {/* </div> */}

      {/* Messages */}
      <div className="chat-body">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`chat-msg ${m.senderId === currentUserId ? "me" : "them"}`}
          >
            {m.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
