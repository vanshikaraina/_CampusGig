// frontend/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Landing from "./pages/Landing.jsx";
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
import MyBids from "./pages/MyBids.jsx";
import ActivityTimelinePage from "./components/Timeline/ActivityTimelinePage";
import SavedJobs from "./pages/SavedJobs.jsx";
import AdminLayout from "./pages/AdminDashboard/AdminLayout";
import AdminUsers from "./pages/AdminDashboard/AdminUsers";
import AdminJobs from "./pages/AdminDashboard/AdminJobs";
import AdminUserDetails from "./pages/AdminDashboard/AdminUserDetails"; // <-- NEW
import DiscussionBoard from "./pages/DiscussionBoard.jsx";         {/* ⬅️ NEW import */}
import SingleDiscussionPost from "./pages/SingleDiscussionPost.jsx"
import NewsList from "./pages/NewsList";
import NewsDetails from "./pages/NewsDetails";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Navbar always visible */}
        <Navbar />

        <div style={{ paddingTop: "64px" }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/jobs" element={<JobsList />} />
            <Route path="/accepted-jobs" element={<AcceptedJobsDashboard />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/my-jobs" element={<MyJobs />} />
            <Route path="/mybids" element={<MyBids />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/chat" element={<ChatList />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/activities" element={<ActivityTimelinePage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs/:jobId/bids" element={<JobBids />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:userId" element={<Portfolio />} />
            {/* // Only for admin */}
            <Route path="/admin/dashboard/*" element={<AdminLayout />} />
            {/* Admin routes */}
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/jobs" element={<AdminJobs />} />
            <Route path="/admin/users/:id" element={<AdminUserDetails />} />  {/* NEW */}
            {/* ⬅️ Discussion Board Routes */}
            <Route path="/discussion/:id" element={<SingleDiscussionPost />} />
            <Route path="/discussion" element={<DiscussionBoard />} /> 
            <Route path="/news" element={<NewsList />} />
            <Route path="/news/:id" element={<NewsDetails />} />

            {/* Full-page chat route */}
            <Route
              path="/chat/:posterId/:jobId/:acceptedUserId"
              element={<UserChatWrapper />}
            />
          </Routes>
        </div>

        {/* Toast notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />

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
