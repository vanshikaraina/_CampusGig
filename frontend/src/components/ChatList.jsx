// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";
// import { useAuth } from "../context/AuthContext";

// export default function ChatList() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [chats, setChats] = useState([]);

//   // useEffect(() => {
//   //   const fetchChats = async () => {
//   //     if (!user?._id) return; // safety check
//   //     try {
//   //       const res = await api.get(`/chat/user/${user._id}`);
//   //       setChats(res.data);
//   //     } catch (err) {
//   //       console.error("Error fetching chats:", err);
//   //     }
//   //   };

//   //   fetchChats();
//   // }, [user?._id]);

//   useEffect(() => {
//   const fetchChats = async () => {
//     if (!user?._id) return;
//     try {
//       const res = await api.get(`/chat/user/${user._id}`);
//       // Only keep chats where posterId and acceptedUserId are populated
//       const populatedChats = res.data.filter(
//         (chat) => chat.posterId?.name && chat.acceptedUserId?.name
//       );
//       setChats(populatedChats);
//     } catch (err) {
//       console.error("Error fetching chats:", err);
//     }
//   };

//   fetchChats();
// }, [user?._id]);


//   const handleChatClick = (chat) => {
//     const otherUser =
//     chat.posterId._id === user._id ? chat.acceptedUserId : chat.posterId;

//     navigate(
//     `/chat/${chat.posterId._id}/${chat.jobId}/${chat.acceptedUserId._id}`,
//     { state: { posterName: otherUser.name } } // show correct name
//     );
//   };

//   return (
//     <div className="chat-list">
//       <h2>Chats</h2>
//       {chats.length === 0 && <p>No chats yet.</p>}
//       {chats.map((chat) => {
//         const otherUser =
//           chat.posterId._id === user._id ? chat.acceptedUserId : chat.posterId;

//         return (
//           <div
//             key={chat._id}
//             className="chat-item"
//             onClick={() => handleChatClick(chat)}
//           >
//             <strong>{otherUser?.name || "Unknown User"}</strong>
//             {/* <p>{chat.messages?.[chat.messages.length - 1]?.text || "No messages yet"}</p> */}
//           </div>
//         );
//       })}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ChatList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      if (!user?._id) return;
      try {
        const res = await api.get(`/chat/user/${user._id}`);
        // Only keep chats where posterId and acceptedUserId are populated
        const populatedChats = res.data.filter(
          (chat) => chat?.posterId?.name && chat?.acceptedUserId?.name
        );
        setChats(populatedChats);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };

    fetchChats();
  }, [user?._id]);

    const handleChatClick = (chat) => {
      if (!chat?.posterId || !chat?.acceptedUserId) return;

      // Determine the "other user"
      const otherUser =
        chat.posterId._id.toString() === user._id
          ? chat.acceptedUserId
          : chat.posterId;

      // If multiple chats exist with this user, pick the latest one
      const otherUserChats = chats.filter(
        (c) =>
          (c.posterId._id.toString() === otherUser._id) ||
          (c.acceptedUserId._id.toString() === otherUser._id)
      );

      // Sort by latest message date
      const latestChat = otherUserChats.sort((a, b) => {
        const aLast = a.messages[a.messages.length - 1]?.createdAt || 0;
        const bLast = b.messages[b.messages.length - 1]?.createdAt || 0;
        return new Date(bLast) - new Date(aLast);
      })[0];

      // Pick jobId from latest message
      const latestJobId = latestChat.messages[latestChat.messages.length - 1]?.jobId;
      if (!latestJobId) return; // skip if no messages yet

      navigate(
        `/chat/${latestChat.posterId._id}/${latestJobId}/${latestChat.acceptedUserId._id}`,
        { state: { posterName: otherUser.name } }
      );

    };


  return (
    <div className="chat-list">
      <h2>Chats</h2>
      {chats.length === 0 ? (
        <p>No chats yet.</p>
      ) : (
        chats.map((chat) => {
          if (!chat?.posterId || !chat?.acceptedUserId) return null;

          const otherUser =
            chat.posterId._id.toString() === user._id
              ? chat.acceptedUserId
              : chat.posterId;

          return (
            <div
              key={chat._id}
              className="chat-item"
              onClick={() => handleChatClick(chat)}
            >
              <strong>{otherUser?.name || "Unknown User"}</strong>
            </div>
          );
        })
      )}
    </div>
  );
}
