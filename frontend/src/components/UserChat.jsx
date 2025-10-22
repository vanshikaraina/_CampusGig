import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../services/api";
import "./UserChat.css";
import { useAuth } from "../context/AuthContext";

export default function UserChat({ currentUserId: propCurrentUserId }) {
  const { posterId, jobId, acceptedUserId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const currentUserId = propCurrentUserId || user?._id;
  const { posterName } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // --- SOCKET.IO SETUP ---
  useEffect(() => {
    if (!posterId || !acceptedUserId || !jobId) return;
    if (socketRef.current) return; // Prevent duplicate connections (React Strict Mode)

    const roomId = [posterId, acceptedUserId, jobId].sort().join("-");
    socketRef.current = io("http://localhost:5000");

    // Join the specific room
    socketRef.current.emit("joinRoom", roomId);

    // Listen for incoming messages
    socketRef.current.on("newMessage", (msg) => {
      // ✅ Ignore echo of own message
      if (msg.senderId !== currentUserId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socketRef.current.emit("leaveRoom", roomId);
      socketRef.current.disconnect();
      socketRef.current = null;
    };
  }, [posterId, acceptedUserId, jobId, currentUserId]);

  // --- FETCH INITIAL CHAT HISTORY ---
  useEffect(() => {
    if (!posterId || !acceptedUserId || !jobId) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/${posterId}/${jobId}/${acceptedUserId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching chat:", err);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [posterId, acceptedUserId, jobId]);

  // --- AUTO SCROLL TO BOTTOM ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- HANDLE INPUT CHANGE ---
  const handleInputChange = (e) => {
    setNewMsg(e.target.value);
  };

  // --- SEND MESSAGE ---
  const handleSend = () => {
    if (!newMsg.trim()) return;

    const roomId = [posterId, acceptedUserId, jobId].sort().join("-");
    const msgData = {
      posterId,
      acceptedUserId,
      jobId,
      senderId: currentUserId,
      text: newMsg.trim(),
    };

    // ✅ Emit message to server
    socketRef.current.emit("sendMessage", msgData);

    // ✅ Add to UI instantly (Optimistic UI)
    setMessages((prev) => [...prev, { ...msgData, _id: Date.now() }]);
    setNewMsg("");
  };

  return (
    <div className="user-chat">
      {/* Header */}
      <div className="chat-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        {(() => {
          const otherUserId = currentUserId === posterId ? acceptedUserId : posterId;
          return <span>Chat with {posterName || otherUserId}</span>;
        })()}
      </div>

      {/* Chat Body */}
      <div className="chat-body">
        {messages.map((m, idx) => (
          <div
            key={m._id || idx}
            className={`chat-msg ${m.senderId === currentUserId ? "me" : "them"}`}
          >
            {m.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="chat-input">
        <input
          type="text"
          value={newMsg}
          onChange={handleInputChange}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
