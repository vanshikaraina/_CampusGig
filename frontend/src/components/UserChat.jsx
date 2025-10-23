// // import React, { useState, useEffect, useRef } from "react";
// // import { useParams, useNavigate, useLocation } from "react-router-dom";
// // import { io } from "socket.io-client";
// // import api from "../services/api";
// // import "./UserChat.css";
// // import { useAuth } from "../context/AuthContext";

// // export default function UserChat({ currentUserId: propCurrentUserId }) {
// //   const { posterId, jobId, acceptedUserId } = useParams();
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const { user } = useAuth();
// //   const currentUserId = propCurrentUserId || user?._id;
// //   const { posterName } = location.state || {};

// //   const [messages, setMessages] = useState([]);
// //   const [newMsg, setNewMsg] = useState("");

// //   const messagesEndRef = useRef(null);
// //   const socketRef = useRef(null);

// //   // --- SOCKET.IO SETUP ---
// //   useEffect(() => {
// //     if (!posterId || !acceptedUserId || !jobId) return;
// //     if (socketRef.current) return; // Prevent duplicate connections (React Strict Mode)

// //     const roomId = [posterId, acceptedUserId, jobId].sort().join("-");
// //     socketRef.current = io("http://localhost:5000");

// //     // Join the specific room
// //     socketRef.current.emit("joinRoom", roomId);

// //     // Listen for incoming messages
// //     socketRef.current.on("newMessage", (msg) => {
// //       // ✅ Ignore echo of own message
// //       if (msg.senderId !== currentUserId) {
// //         setMessages((prev) => [...prev, msg]);
// //       }
// //     });

// //     return () => {
// //       socketRef.current.emit("leaveRoom", roomId);
// //       socketRef.current.disconnect();
// //       socketRef.current = null;
// //     };
// //   }, [posterId, acceptedUserId, jobId, currentUserId]);

// //   // --- FETCH INITIAL CHAT HISTORY ---
// //   useEffect(() => {
// //     if (!posterId || !acceptedUserId || !jobId) return;

// //     const fetchMessages = async () => {
// //       try {
// //         const res = await api.get(`/chat/${posterId}/${jobId}/${acceptedUserId}`);
// //         setMessages(res.data);
// //       } catch (err) {
// //         console.error("Error fetching chat:", err);
// //         setMessages([]);
// //       }
// //     };

// //     fetchMessages();
// //   }, [posterId, acceptedUserId, jobId]);

// //   // --- AUTO SCROLL TO BOTTOM ---
// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages]);

// //   // --- HANDLE INPUT CHANGE ---
// //   const handleInputChange = (e) => {
// //     setNewMsg(e.target.value);
// //   };

// //   // --- SEND MESSAGE ---
// //   const handleSend = () => {
// //     if (!newMsg.trim()) return;

// //     const roomId = [posterId, acceptedUserId, jobId].sort().join("-");
// //     const msgData = {
// //       posterId,
// //       acceptedUserId,
// //       jobId,
// //       senderId: currentUserId,
// //       text: newMsg.trim(),
// //     };

// //     // ✅ Emit message to server
// //     socketRef.current.emit("sendMessage", msgData);

// //     // ✅ Add to UI instantly (Optimistic UI)
// //     setMessages((prev) => [...prev, { ...msgData, _id: Date.now() }]);
// //     setNewMsg("");
// //   };

// //   return (
// //     <div className="user-chat">
// //       {/* Header */}
// //       <div className="chat-header">
// //         <button className="back-btn" onClick={() => navigate(-1)}>←</button>
// //         {(() => {
// //           const otherUserId = currentUserId === posterId ? acceptedUserId : posterId;
// //           return <span>Chat with {posterName || otherUserId}</span>;
// //         })()}
// //       </div>

// //       {/* Chat Body */}
// //       <div className="chat-body">
// //         {messages.map((m, idx) => (
// //           <div
// //             key={m._id || idx}
// //             className={`chat-msg ${m.senderId === currentUserId ? "me" : "them"}`}
// //           >
// //             {m.text}
// //           </div>
// //         ))}
// //         <div ref={messagesEndRef} />
// //       </div>

// //       {/* Chat Input */}
// //       <div className="chat-input">
// //         <input
// //           type="text"
// //           value={newMsg}
// //           onChange={handleInputChange}
// //           placeholder="Type a message..."
// //           onKeyDown={(e) => e.key === "Enter" && handleSend()}
// //         />
// //         <button onClick={handleSend}>Send</button>
// //       </div>
// //     </div>
// //   );
// // }


// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { io } from "socket.io-client";
// import api from "../services/api";
// import "./UserChat.css";
// import { useAuth } from "../context/AuthContext";
// import { FaMicrophone, FaStop, FaCheck, FaTimes, FaArrowLeft, FaPaperPlane } from "react-icons/fa";

// export default function UserChat({ currentUserId: propCurrentUserId }) {
//   const { posterId, jobId, acceptedUserId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useAuth();
//   const currentUserId = propCurrentUserId || user?._id;
//   const { posterName } = location.state || {};

//   const [messages, setMessages] = useState([]);
//   const [newMsg, setNewMsg] = useState("");
//   const [recording, setRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState(null);
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [recordTime, setRecordTime] = useState(0);

//   const messagesEndRef = useRef(null);
//   const socketRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const timerRef = useRef(null);

//   const otherUserId = currentUserId === posterId ? acceptedUserId : posterId;
//   const [otherUserOnline, setOtherUserOnline] = useState(false);

//   useEffect(() => {
//     if (!socketRef.current || !otherUserId || !currentUserId) return;

//     // Notify server this user is online
//     socketRef.current.emit("userOnline", currentUserId);

//     // Listen for online users updates
//     socketRef.current.on("updateUserStatus", (onlineUsers) => {
//       setOtherUserOnline(!!onlineUsers[otherUserId]);
//     });

//     return () => {
//       socketRef.current.off("updateUserStatus");
//     };
//   }, [socketRef.current, otherUserId, currentUserId]);

//   // --- SOCKET.IO ---
//   useEffect(() => {
//     if (!posterId || !acceptedUserId || !jobId) return;
//     if (socketRef.current) return;

//     const roomId = [posterId, acceptedUserId, jobId].sort().join("-");
//     socketRef.current = io("http://localhost:5000");

//     socketRef.current.emit("joinRoom", roomId);

//     socketRef.current.on("newMessage", (msg) => {
//       // Only append valid messages
//       if (msg.text || msg.file) {
//         setMessages((prev) => [...prev, msg]);
//       }
//     });

//     return () => {
//       socketRef.current.emit("leaveRoom", roomId);
//       socketRef.current.disconnect();
//       socketRef.current = null;
//     };
//   }, [posterId, acceptedUserId, jobId, currentUserId]);

//   // --- FETCH INITIAL MESSAGES ---
//   useEffect(() => {
//     if (!posterId || !acceptedUserId || !jobId) return;

//     const fetchMessages = async () => {
//       try {
//         const res = await api.get(`/chat/${posterId}/${jobId}/${acceptedUserId}`);
//         setMessages(res.data);
//       } catch (err) {
//         console.error(err);
//         setMessages([]);
//       }
//     };
//     fetchMessages();
//   }, [posterId, acceptedUserId, jobId]);

//   // --- SCROLL TO BOTTOM ---
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // --- TEXT MESSAGE ---
//   const handleInputChange = (e) => setNewMsg(e.target.value);

// const handleSend = async () => {
//   if (!newMsg.trim()) return;

//   const msgData = {
//     posterId,
//     acceptedUserId,
//     jobId,
//     senderId: currentUserId,
//     text: newMsg.trim(),
//     file: "",
//     fileType: "",
//   };

//   setNewMsg(""); // Clear input immediately

//   try {
//     const res = await api.post("/chat", msgData); // Save in DB
//     const savedMessage = res.data[res.data.length - 1]; // Only take the last message

//     setMessages(prev => [...prev, savedMessage]); // Append just the new message
//     socketRef.current.emit("sendMessage", savedMessage); // Emit saved message
//   } catch (err) {
//     console.error(err);
//   }
// };



//   const sendMessage = (msgContent) => {
//     const roomId = [posterId, acceptedUserId, jobId].sort().join("-");
//     const msgData = {
//       posterId,
//       acceptedUserId,
//       jobId,
//       senderId: currentUserId,
//       ...msgContent,
//     };
//     socketRef.current.emit("sendMessage", msgData);
//     setMessages((prev) => [...prev, { ...msgData, _id: Date.now() }]);
//   };

//   // --- VOICE MESSAGE ---
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const recorder = new MediaRecorder(stream);
//       setMediaRecorder(recorder);
//       audioChunksRef.current = [];
//       setRecording(true);
//       setRecordTime(0);

//       timerRef.current = setInterval(() => setRecordTime((t) => t + 1), 1000);

//       recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);

//       recorder.onstop = () => {
//         const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
//         setAudioBlob(blob);
//         clearInterval(timerRef.current);
//       };

//       recorder.start();
//     } catch (err) {
//       console.error("Microphone access denied", err);
//     }
//   };

//   const stopRecording = () => {
//     mediaRecorder?.stop();
//     setRecording(false);
//   };

//   const cancelRecording = () => {
//     setAudioBlob(null);
//     setRecording(false);
//     clearInterval(timerRef.current);
//   };

//   const sendAudio = async () => {
//     if (!audioBlob) return;

//     const file = new File([audioBlob], `voice-${Date.now()}.webm`, { type: "audio/webm" });
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       // Upload audio
//       const res = await api.post("/chat/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       const fileUrl = res.data.url;

//       // Send message to backend (backend saves & emits via Socket.IO)
//       const msgData = {
//         posterId,
//         acceptedUserId,
//         jobId,
//         senderId: currentUserId,
//         file: fileUrl,
//         fileType: "audio",
//         text: "",
//       };

//       const savedMessages = await api.post("/chat", msgData);

//       // Append the last message locally so it shows immediately
//       setMessages((prev) => [...prev, savedMessages.data[savedMessages.data.length - 1]]);
//       setAudioBlob(null); // Clear recording
//     } catch (err) {
//       console.error("Voice message upload failed", err);
//     }
//   };



//   const renderMessage = (m) => {
//     if (m.text) return <span>{m.text}</span>;
//     if (m.fileType === "image") return <img src={m.file} alt="sent" className="chat-file" />;
//     if (m.fileType === "video") return <video src={m.file} controls className="chat-file" />;
//     if (m.fileType === "audio" && m.file) {
//       return <audio controls src={m.file} />;
//     }
//     return null;
//   };

//   return (
//     <div className="user-chat">
//       <div className="chat-header">
//         <button className="back-btn" onClick={() => navigate(-1)}><FaArrowLeft /></button>
//         <span>
//           {posterName || otherUserId}
//           <span className={`user-status ${otherUserOnline ? "online" : "offline"}`}>
//             {otherUserOnline ? "Online" : "Offline"}
//           </span>
//         </span>
//       </div>

// <div className="chat-body">
//   {messages.map((m, idx) => (
//     <div key={m._id || idx} className={`chat-msg ${m.senderId === currentUserId ? "me" : "them"}`}>
//       {renderMessage(m)}
//     </div>
//   ))}
//   <div ref={messagesEndRef} />
// </div>


//       <div className="chat-input">
//         {!audioBlob && (
//           <>
//             <input
//               type="text"
//               value={newMsg}
//               onChange={handleInputChange}
//               placeholder="Type a message..."
//               onKeyDown={(e) => e.key === "Enter" && handleSend()}
//             />
//             <button className="send-btn" onClick={handleSend}><FaPaperPlane /></button>
//             {!recording && <button className="record-btn" onClick={startRecording}><FaMicrophone /></button>}
//             {recording && <button className="stop-btn" onClick={stopRecording}><FaStop /> ({recordTime}s)</button>}
//           </>
//         )}

//         {audioBlob && (
//           <div className="voice-preview">
//             <audio controls src={URL.createObjectURL(audioBlob)} />
//             <button className="send-audio-btn" onClick={sendAudio}><FaCheck /></button>
//             <button className="cancel-audio-btn" onClick={cancelRecording}><FaTimes /></button>
//           </div>
//         )}
//       </div>

//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../services/api";
import "./UserChat.css";
import { useAuth } from "../context/AuthContext";
import { FaMicrophone, FaStop, FaCheck, FaTimes, FaArrowLeft, FaPaperPlane, FaSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react"; // install: npm i emoji-picker-react

export default function UserChat({ currentUserId: propCurrentUserId }) {
  const { posterId, jobId, acceptedUserId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const currentUserId = propCurrentUserId || user?._id;
  const { posterName } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordTime, setRecordTime] = useState(0);

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const otherUserId = currentUserId === posterId ? acceptedUserId : posterId;
  const [otherUserOnline, setOtherUserOnline] = useState(false);

  // --- Socket.IO online status ---
  useEffect(() => {
    if (!socketRef.current || !otherUserId || !currentUserId) return;
    socketRef.current.emit("userOnline", currentUserId);

    socketRef.current.on("updateUserStatus", (onlineUsers) => {
      setOtherUserOnline(!!onlineUsers[otherUserId]);
    });

    return () => socketRef.current.off("updateUserStatus");
  }, [socketRef.current, otherUserId, currentUserId]);

  // --- Socket.IO messages ---
  useEffect(() => {
    if (!posterId || !acceptedUserId || !jobId) return;
    if (socketRef.current) return;

    const roomId = [posterId, acceptedUserId, jobId].sort().join("-");
    socketRef.current = io("http://localhost:5000");

    socketRef.current.emit("joinRoom", roomId);

    socketRef.current.on("newMessage", (msg) => {
      if (msg.text || msg.file) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socketRef.current.emit("leaveRoom", roomId);
      socketRef.current.disconnect();
      socketRef.current = null;
    };
  }, [posterId, acceptedUserId, jobId, currentUserId]);

  // --- Fetch initial messages ---
  useEffect(() => {
    if (!posterId || !acceptedUserId || !jobId) return;
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/${posterId}/${jobId}/${acceptedUserId}`);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
        setMessages([]);
      }
    };
    fetchMessages();
  }, [posterId, acceptedUserId, jobId]);

  // --- Scroll to bottom ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Send text message ---
  const handleInputChange = (e) => setNewMsg(e.target.value);

  const handleSend = async () => {
    if (!newMsg.trim()) return;

    const msgData = {
      posterId,
      acceptedUserId,
      jobId,
      senderId: currentUserId,
      text: newMsg.trim(),
      file: "",
      fileType: "",
    };

    setNewMsg("");

    try {
      // send via API
      const res = await api.post("/chat", msgData);
      const savedMessage = res.data[res.data.length - 1];
      setMessages((prev) => [...prev, savedMessage]);

      // emit via socket
      socketRef.current.emit("sendMessage", savedMessage);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Emoji Picker ---
  const handleEmojiClick = (emojiObject) => {
    setNewMsg((prev) => prev + (emojiObject?.emoji || ""));
  };

  const toggleEmojiPicker = () => setShowEmojiPicker((prev) => !prev);

  // --- Voice message ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      audioChunksRef.current = [];
      setRecording(true);
      setRecordTime(0);

      timerRef.current = setInterval(() => setRecordTime((t) => t + 1), 1000);

      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        clearInterval(timerRef.current);
      };

      recorder.start();
    } catch (err) {
      console.error("Microphone access denied", err);
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
  };

  const cancelRecording = () => {
    setAudioBlob(null);
    setRecording(false);
    clearInterval(timerRef.current);
  };

  const sendAudio = async () => {
    if (!audioBlob) return;

    const file = new File([audioBlob], `voice-${Date.now()}.webm`, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/chat/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const fileUrl = res.data.url;

      const msgData = {
        posterId,
        acceptedUserId,
        jobId,
        senderId: currentUserId,
        file: fileUrl,
        fileType: "audio",
        text: "",
      };

      const savedMessages = await api.post("/chat", msgData);
      setMessages((prev) => [...prev, savedMessages.data[savedMessages.data.length - 1]]);
      setAudioBlob(null);
    } catch (err) {
      console.error("Voice message upload failed", err);
    }
  };

  // --- Render messages ---
  const renderMessage = (m) => {
    if (m.text) return <span>{m.text}</span>;
    if (m.fileType === "image") return <img src={m.file} alt="sent" className="chat-file" />;
    if (m.fileType === "video") return <video src={m.file} controls className="chat-file" />;
    if (m.fileType === "audio" && m.file) return <audio controls src={m.file} />;
    return null;
  };

  return (
    <div className="user-chat">
    <div className="chat-header">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </button>

      <div className="user-info">
        <span className="username">{posterName || otherUserId}</span>
        <span className={`user-status ${otherUserOnline ? "online" : "offline"}`}>
          {otherUserOnline ? "Online" : "Offline"}
        </span>
      </div>
    </div>

      <div className="chat-body">
        {messages.map((m, idx) => (
          <div
            key={m._id || idx}
            className={`chat-msg-wrapper ${m.senderId === currentUserId ? "me-wrapper" : "them-wrapper"}`}
          >
            <div className={`chat-msg ${m.senderId === currentUserId ? "me" : "them"}`}>
              {renderMessage(m)}
            </div>

            {m.senderId === currentUserId && m.seen && idx === messages.length - 1 && (
              <div className="seen-label-below">Seen</div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <div className="input-row">
          <input
            type="text"
            value={newMsg}
            onChange={handleInputChange}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button className="emoji-btn" onClick={toggleEmojiPicker}><FaSmile /></button>
          <button className="send-btn" onClick={handleSend}><FaPaperPlane /></button>
          {!recording && <button className="record-btn" onClick={startRecording}><FaMicrophone /></button>}
          {recording && <button className="stop-btn" onClick={stopRecording}><FaStop /> ({recordTime}s)</button>}
        </div>

        {showEmojiPicker && (
          <div className="emoji-picker-wrapper">
            <button className="close-emoji-btn" onClick={toggleEmojiPicker}>×</button>
            <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
          </div>
        )}

        {audioBlob && (
          <div className="voice-preview">
            <audio controls src={URL.createObjectURL(audioBlob)} />
            <button className="send-audio-btn" onClick={sendAudio}><FaCheck /></button>
            <button className="cancel-audio-btn" onClick={cancelRecording}><FaTimes /></button>
          </div>
        )}
      </div>
    </div>
  );
}
