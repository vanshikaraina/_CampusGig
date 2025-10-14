import React, { useState, useEffect, useRef } from "react";
import "./ChatWidget.css";

const FAQ_OPTIONS = [
  { question: "What are your working hours?", answer: "We operate from 9 AM to 6 PM, Monday to Friday." },
  { question: "How can I post a job?", answer: "Go to 'Post Job' page and fill the job details form." },
  { question: "How do I accept a job?", answer: "On the jobs list, click 'Accept' for any available job." },
  { question: "How do I contact support?", answer: "Use the 'Contact Us' form or email support@campusgig.com." },
  { question: "Other issues", answer: null }, // for user input
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [showInput, setShowInput] = useState(false);

  const messagesEndRef = useRef(null); // ✅ ref for scrolling

  // Load chat history from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("chatMessages") || "[]");
    setMessages(saved);
  }, []);

  // Save chat to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Scroll to latest message when messages or chat open state changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleOptionClick = (option) => {
    if (option.answer) {
      setMessages((prev) => [...prev, { from: "user", text: option.question }]);
      setMessages((prev) => [...prev, { from: "bot", text: option.answer }]);
    } else {
      setShowInput(true);
      setMessages((prev) => [...prev, { from: "user", text: option.question }]);
    }
  };

  const handleSend = () => {
    if (!userInput.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text: userInput }]);
    setMessages((prev) => [...prev, { from: "bot", text: "Thanks for your query! We'll get back to you soon." }]);
    setUserInput("");
    setShowInput(false);
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <div className="chat-icon" onClick={() => setOpen(!open)}>
        💬
      </div>

      {open && (
        <div className="chat-window">
          <div className="chat-header">
            Customer Support
            <span
              className="chat-close"
              onClick={() => setOpen(false)}
              style={{
                float: "right",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              ×
            </span>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-msg ${msg.from}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} /> {/* ✅ scroll target */}
          </div>

          {!showInput && (
            <div className="chat-options">
              {FAQ_OPTIONS.map((opt, idx) => (
                <button key={idx} onClick={() => handleOptionClick(opt)}>
                  {opt.question}
                </button>
              ))}
            </div>
          )}

          {showInput && (
            <div className="chat-input">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your query..."
              />
              <button onClick={handleSend}>Send</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
