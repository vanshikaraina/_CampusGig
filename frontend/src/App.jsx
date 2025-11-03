// frontend/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing.jsx"; // ✅ Import the landing page
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import AcceptedJobsDashboard from "./pages/AcceptedJobsDashboard";
import Dashboard from "./pages/Dashboard.jsx";
import Navbar from "./pages/Navbar.jsx";
import Profile from "./pages/Profile";
import JobsList from "./pages/jobsList";
import PostJob from "./pages/PostJobs.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
import UserChat from "./components/UserChat.jsx";
import ChatList from "./components/ChatList.jsx";
import MyJobs from "./pages/MyJobs.jsx";
import JobBids from "./pages/JobBids";
import Portfolio from "./pages/Portfolio.jsx";
import MyBids from "./pages/MyBids.jsx"; // 🆕 Added
import ActivityTimelinePage from "./components/Timeline/ActivityTimelinePage"; // adjust path

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Navbar always visible */}
        <Navbar />

        <div style={{ paddingTop: "64px" }}>
          <Routes>
            <Route path="/" element={<Landing />} />           {/* Landing page */}
            <Route path="/jobs" element={<JobsList />} />     {/* Jobs list page */}
            <Route path="/accepted-jobs" element={<AcceptedJobsDashboard />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/my-jobs" element={<MyJobs />} />
            <Route path="/mybids" element={<MyBids />} /> {/* 🆕 Added */}
            <Route path="/chat" element={<ChatList />} />  {/* ✅ Add this */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/activities" element={<ActivityTimelinePage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs/:jobId/bids" element={<JobBids />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:userId" element={<Portfolio />} />

            {/* Full-page chat route */}
            <Route
              path="/chat/:posterId/:jobId/:acceptedUserId"
              element={<UserChatWrapper />}
            />
          </Routes>
        </div>

        {/* Chat widget appears on all screens */}
        <ChatWidget />
      </BrowserRouter>
    </AuthProvider>
  );
}

// Wrapper component to safely get currentUserId from AuthContext
function UserChatWrapper() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return <UserChat currentUserId={user?._id} />;
}
