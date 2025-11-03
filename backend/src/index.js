// // index.js
// import "dotenv/config";
// import { connectDB } from "./config/db.js";
// import app from "./app.js";
// import http from "http";
// import { Server } from "socket.io";
// import mongoose from "mongoose";
// import Chat from "./models/Chat.js";

// const PORT = process.env.PORT || 5000;

// // Connect DB
// await connectDB();

// // Create HTTP server
// const server = http.createServer(app);

// // Initialize Socket.IO
// const io = new Server(server, {
//   cors: { origin: "http://localhost:5173" },
// });

// io.on("connection", (socket) => {
//   console.log("New client connected:", socket.id);

//   // Join a chat room
//   socket.on("joinRoom", (roomId) => {
//     socket.join(roomId);
//     console.log(socket.id, "joined room", roomId);
//   });

//   // Leave a room
//   socket.on("leaveRoom", (roomId) => {
//     socket.leave(roomId);
//     console.log(socket.id, "left room", roomId);
//   });

//   // Send message
//   socket.on("sendMessage", async (msgData) => {
//     try {
//       const { posterId, acceptedUserId, jobId, senderId, text } = msgData;

//       const posterObjId = new mongoose.Types.ObjectId(posterId);
//       const acceptedObjId = new mongoose.Types.ObjectId(acceptedUserId);
//       const senderObjId = new mongoose.Types.ObjectId(senderId);
//       const jobObjId = new mongoose.Types.ObjectId(jobId);

//       let chat = await Chat.findOne({
//         $or: [
//           { posterId: posterObjId, acceptedUserId: acceptedObjId },
//           { posterId: acceptedObjId, acceptedUserId: posterObjId },
//         ],
//       });

//       if (!chat) {
//         chat = new Chat({
//           posterId: posterObjId,
//           acceptedUserId: acceptedObjId,
//           messages: [],
//         });
//       }

//       chat.messages.push({
//         senderId: senderObjId,
//         text: msgData.text || "",
//         file: msgData.file || "",
//         fileType: msgData.fileType || "",
//         jobId: jobObjId,
//       });
//       await chat.save();

//       const roomId = [posterId, acceptedUserId, jobId].sort().join("-");
//       const newMsg = chat.messages[chat.messages.length - 1];

//       io.to(roomId).emit("newMessage", newMsg);
//     } catch (err) {
//       console.error("Socket sendMessage error:", err);
//     }
//   });

//   // Mark messages as seen
//   socket.on("messageSeen", async ({ posterId, acceptedUserId, jobId, viewerId }) => {
//     try {
//       const posterObjId = new mongoose.Types.ObjectId(posterId);
//       const acceptedObjId = new mongoose.Types.ObjectId(acceptedUserId);

//       const chat = await Chat.findOne({
//         $or: [
//           { posterId: posterObjId, acceptedUserId: acceptedObjId },
//           { posterId: acceptedObjId, acceptedUserId: posterObjId },
//         ],
//       });

//       if (!chat) return;

//       // Update all messages from the other user to seen
//       chat.messages.forEach((msg) => {
//         if (msg.senderId.toString() !== viewerId) {
//           msg.seen = true;
//         }
//       });

//       await chat.save();

//       const roomId = [posterId, acceptedUserId, jobId].sort().join("-");
//       io.to(roomId).emit("messageSeenUpdate", chat.messages);
//     } catch (err) {
//       console.error("Socket messageSeen error:", err);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });
// });

// // Start server
// server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));







// =-=====================





// // index.js
// import "dotenv/config";
// import { connectDB } from "./config/db.js";
// import app from "./app.js";
// import http from "http";
// import { Server } from "socket.io";
// import mongoose from "mongoose";
// import Chat from "./models/Chat.js";

// const PORT = process.env.PORT || 5000;

// // Connect DB
// await connectDB();

// // Create HTTP server
// const server = http.createServer(app);

// // Initialize Socket.IO
// const io = new Server(server, {
//   cors: { origin: "http://localhost:5173" },
// });
// const users = {}; // <---- add this above io.on(...)
// io.on("connection", (socket) => {
//   console.log("New client connected:", socket.id);

//   // ✅ Send socket ID to the client when connected
//   socket.emit("me", socket.id);

//   // ---------------- CHAT EVENTS ----------------
//   socket.on("joinRoom", (roomId) => {
//     socket.join(roomId);
//     console.log(socket.id, "joined room", roomId);
//   });

//   socket.on("leaveRoom", (roomId) => {
//     socket.leave(roomId);
//     console.log(socket.id, "left room", roomId);
//   });

//   socket.on("sendMessage", async (msgData) => {
//     try {
//       const { posterId, acceptedUserId, jobId, senderId, text } = msgData;

//       const posterObjId = new mongoose.Types.ObjectId(posterId);
//       const acceptedObjId = new mongoose.Types.ObjectId(acceptedUserId);
//       const senderObjId = new mongoose.Types.ObjectId(senderId);
//       const jobObjId = new mongoose.Types.ObjectId(jobId);

//       let chat = await Chat.findOne({
//         $or: [
//           { posterId: posterObjId, acceptedUserId: acceptedObjId },
//           { posterId: acceptedObjId, acceptedUserId: posterObjId },
//         ],
//       });

//       if (!chat) {
//         chat = new Chat({
//           posterId: posterObjId,
//           acceptedUserId: acceptedObjId,
//           messages: [],
//         });
//       }

//       chat.messages.push({
//         senderId: senderObjId,
//         text: msgData.text || "",
//         file: msgData.file || "",
//         fileType: msgData.fileType || "",
//         jobId: jobObjId,
//       });
//       await chat.save();

//       const roomId = [posterId, acceptedUserId, jobId].sort().join("-");
//       const newMsg = chat.messages[chat.messages.length - 1];

//       io.to(roomId).emit("newMessage", newMsg);
//     } catch (err) {
//       console.error("Socket sendMessage error:", err);
//     }
//   });

//   socket.on("messageSeen", async ({ posterId, acceptedUserId, jobId, viewerId }) => {
//     try {
//       const posterObjId = new mongoose.Types.ObjectId(posterId);
//       const acceptedObjId = new mongoose.Types.ObjectId(acceptedUserId);

//       const chat = await Chat.findOne({
//         $or: [
//           { posterId: posterObjId, acceptedUserId: acceptedObjId },
//           { posterId: acceptedObjId, acceptedUserId: posterObjId },
//         ],
//       });

//       if (!chat) return;

//       chat.messages.forEach((msg) => {
//         if (msg.senderId.toString() !== viewerId) {
//           msg.seen = true;
//         }
//       });

//       await chat.save();

//       const roomId = [posterId, acceptedUserId, jobId].sort().join("-");
//       io.to(roomId).emit("messageSeenUpdate", chat.messages);
//     } catch (err) {
//       console.error("Socket messageSeen error:", err);
//     }
//   });

//   // ---------------- VIDEO CALL EVENTS ----------------
//   // When a user initiates a call
// socket.on("callUser", (data) => {
//   const targetSocket = users[data.userToCall]; // 👈 get receiver’s socket ID
//   if (targetSocket) {
//     console.log(`📞 Call initiated from ${data.from} to ${data.userToCall}`);
//     io.to(targetSocket).emit("callIncoming", {
//       signal: data.signal,
//       from: socket.id,
//       name: data.name,
//     });
//   } else {
//     console.log(`⚠️ User ${data.userToCall} not online`);
//   }
// });


//   // When the receiver accepts the call
//   socket.on("answerCall", (data) => {
//     console.log(`✅ Call accepted by ${data.to}`);
//     io.to(data.to).emit("callAccepted", data.signal);
//   });

//   // When the receiver rejects the call
//   socket.on("rejectCall", (data) => {
//     console.log(`❌ Call rejected by ${data.to}`);
//     io.to(data.to).emit("callRejected");
//   });

//   // When either user ends the call
//   socket.on("endCall", (data) => {
//     console.log(`📴 Call ended by ${data.from}`);
//     io.to(data.to).emit("callEnded");
//   });

//   socket.on("endCall", ({ to }) => {
//   io.to(to).emit("callEnded");
// });

// socket.on("registerUser", (userId) => {
//   users[userId] = socket.id;
//   console.log(`🟢 Registered user ${userId} with socket ${socket.id}`);
//   console.log("All users:", users);

//   // 🔹 Broadcast updated user list to everyone
//   io.emit("onlineUsers", Object.keys(users));
// });

// socket.on("disconnect", () => {
//   for (const id in users) {
//     if (users[id] === socket.id) delete users[id];
//   }
//   console.log("Client disconnected:", socket.id);

//   // 🔹 Send updated user list again
//   io.emit("onlineUsers", Object.keys(users));
// });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });
// });

// // Start server
// server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));













// index.js
import "dotenv/config";
import { connectDB } from "./config/db.js";
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import Chat from "./models/Chat.js";

const PORT = process.env.PORT || 5000;

// Connect DB
await connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

const users = {}; // store userId -> socket.id mapping

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  socket.emit("me", socket.id);

  // ---------------- CHAT EVENTS ----------------
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(socket.id, "joined room", roomId);
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(socket.id, "left room", roomId);
  });

  socket.on("sendMessage", async (msgData) => {
    try {
      const { posterId, acceptedUserId, jobId, senderId, text } = msgData;

      const posterObjId = new mongoose.Types.ObjectId(posterId);
      const acceptedObjId = new mongoose.Types.ObjectId(acceptedUserId);
      const senderObjId = new mongoose.Types.ObjectId(senderId);
      const jobObjId = new mongoose.Types.ObjectId(jobId);

      let chat = await Chat.findOne({
        $or: [
          { posterId: posterObjId, acceptedUserId: acceptedObjId },
          { posterId: acceptedObjId, acceptedUserId: posterObjId },
        ],
      });

      if (!chat) {
        chat = new Chat({
          posterId: posterObjId,
          acceptedUserId: acceptedObjId,
          messages: [],
        });
      }

      chat.messages.push({
        senderId: senderObjId,
        text: msgData.text || "",
        file: msgData.file || "",
        fileType: msgData.fileType || "",
        jobId: jobObjId,
      });

      await chat.save();

      const roomId = [posterId, acceptedUserId, jobId].sort().join("-");
      const newMsg = chat.messages[chat.messages.length - 1];

      io.to(roomId).emit("newMessage", newMsg);
    } catch (err) {
      console.error("Socket sendMessage error:", err);
    }
  });

  socket.on("messageSeen", async ({ posterId, acceptedUserId, jobId, viewerId }) => {
    try {
      const posterObjId = new mongoose.Types.ObjectId(posterId);
      const acceptedObjId = new mongoose.Types.ObjectId(acceptedUserId);

      const chat = await Chat.findOne({
        $or: [
          { posterId: posterObjId, acceptedUserId: acceptedObjId },
          { posterId: acceptedObjId, acceptedUserId: posterObjId },
        ],
      });

      if (!chat) return;

      chat.messages.forEach((msg) => {
        if (msg.senderId.toString() !== viewerId) {
          msg.seen = true;
        }
      });

      await chat.save();

      const roomId = [posterId, acceptedUserId, jobId].sort().join("-");
      io.to(roomId).emit("messageSeenUpdate", chat.messages);
    } catch (err) {
      console.error("Socket messageSeen error:", err);
    }
  });

  // ---------------- VIDEO CALL EVENTS ----------------
  socket.on("registerUser", (userId) => {
    socket.userId = userId; // <--- add this line
    users[userId] = socket.id;
    console.log(`🟢 Registered user ${userId} with socket ${socket.id}`);
    console.log("All users:", users);
    io.emit("onlineUsers", Object.keys(users));
  });

  socket.on("callUser", (data) => {
    const targetSocket = users[data.userToCall];
    if (targetSocket) {
      console.log(`📞 Call initiated from ${data.from} to ${data.userToCall}`);
      io.to(targetSocket).emit("callIncoming", {
        signal: data.signal,
        from: data.from,
        name: data.name,
      });
    } else {
      console.log(`⚠️ User ${data.userToCall} not online`);
    }
  });

  socket.on("answerCall", (data) => {
    console.log(`✅ Call accepted by ${data.to}`);
    io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("rejectCall", (data) => {
    console.log(`❌ Call rejected by ${data.to}`);
    io.to(data.to).emit("callRejected");
  });

  // ✅ When either user ends the call, both get notified
  // socket.on("endCall", ({ to }) => {
  //   const from = socket.userId; // <-- store your connected user ID when they join
  //   console.log(`📴 Call ended by ${from}`);

  //   const callerSocket = users[from];
  //   const receiverSocket = users[to];

  //   if (receiverSocket) {
  //     io.to(receiverSocket).emit("callEnded");
  //     console.log(`📤 Sent callEnded to receiver ${to}`);
  //   }

  //   if (callerSocket) {
  //     io.to(callerSocket).emit("callEnded");
  //     console.log(`📤 Sent callEnded to caller ${from}`);
  //   }

  //   console.log(`✅ Call fully ended between ${from} and ${to}`);
  // });

  socket.on("endCall", ({ from, to }) => {
    console.log("📴 endCall received:", { from, to });

    const callerSocket = users[from];
    const receiverSocket = users[to];

    if (receiverSocket) {
      io.to(receiverSocket).emit("callEnded");
      console.log(`📤 Sent callEnded to receiver ${to}`);
    }

    if (callerSocket) {
      io.to(callerSocket).emit("callEnded");
      console.log(`📤 Sent callEnded to caller ${from}`);
    }

    console.log(`✅ Call fully ended between ${from} and ${to}`);
  });




  // Handle disconnection
  socket.on("disconnect", () => {
    for (const id in users) {
      if (users[id] === socket.id) {
        delete users[id];
        break;
      }
    }
    io.emit("onlineUsers", Object.keys(users));
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
