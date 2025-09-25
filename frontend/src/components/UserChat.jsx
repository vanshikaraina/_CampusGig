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
  const socketRef = useRef();

  // Connect to Socket.IO
  useEffect(() => {
    if (!posterId || !acceptedUserId || !jobId) return;

    // const roomId = [posterId, acceptedUserId, jobId].sort().join("-");
    const roomId = [posterId, acceptedUserId, jobId].sort().join("-");
    socketRef.current = io("http://localhost:5000");

    // Join room
    socketRef.current.emit("joinRoom", roomId);

    // Listen for new messages
    socketRef.current.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.emit("leaveRoom", roomId);
      socketRef.current.disconnect();
    };
  }, [posterId, acceptedUserId, jobId, currentUserId]);

  // Fetch initial messages from API
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

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle input change
  const handleInputChange = (e) => {
    setNewMsg(e.target.value);
  };

  // Send message
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

    // Emit to server
    socketRef.current.emit("sendMessage", msgData);

    // Update local state immediately
    setMessages((prev) => [...prev, { ...msgData, _id: Date.now() }]); // temp ID
    setNewMsg("");
  };

  return (
    <div className="user-chat">
      {/* Header */}
      <div className="chat-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        Chat with {posterName || (acceptedUserId === currentUserId ? posterId : acceptedUserId)}
      </div>

      {/* Messages */}
      <div className="chat-body">
        {messages.map((m, idx) => (
          <div key={idx} className={`chat-msg ${m.senderId === currentUserId ? "me" : "them"}`}>
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
          onChange={handleInputChange}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
