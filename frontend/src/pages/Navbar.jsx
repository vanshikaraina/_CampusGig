
// // Navbar.jsx
// import { Link, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import "./AppStyles.css";
// import api from "../services/api"; // adjust path if needed

// export default function Navbar() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null); // ← add this
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     api.get("/auth/me")
//       .then(res => {
//         setUser(res.data.user); // adjust based on backend response
//       })
//       .catch(() => setUser(null))
//       .finally(() => setLoading(false));
//   }, []);
//   const handleLogout = async () => {
//     try {
//       await api.post("/auth/logout"); // optional backend call to clear cookie
//     } catch (err) {
//       console.error(err);
//     }
//     setUser(null);
//     navigate("/login");
//   };
  
//   if (loading) return null; // or a loader if you want
//   const loggedIn = !!user;
//   return (
//     <nav className="navbar">
//       <div className="nav-left">
//         <Link to="/" className="logo">CampusGig</Link>
//       </div>
//       <div className="nav-center">
//         <Link to="/">Jobs</Link>
//         {/* <Link to="/accept-job" className="nav-link">Accepted Jobs</Link> */}
//         {/* <Link to="/search-job" className="nav-link">Search Job</Link> */}
//         <Link to="/post-job">Post Job</Link>
//         {/* <input type="text" placeholder="Search..." className="nav-search" /> */}
//       </div>
//       <div className="nav-right">
//         {/* Show Profile only if logged in */}
//         {loggedIn && <Link to="/profile" className="nav-link">Profile</Link>}
//         {!loggedIn ? (
//           <>
//             <Link to="/login" className="nav-btn">Login</Link>
//             <Link to="/signup" className="nav-btn signup-btn">Signup</Link>
//           </>
//         ) : (
//           <button className="nav-btn signup-btn" onClick={handleLogout}>Logout</button>
//         )}
//       </div>
//     </nav>
//   );
// }


import { Link, useNavigate } from "react-router-dom";
import "./AppStyles.css";
import api from "../services/api";
import { useAuth } from "../context/AuthContext"; // ✅ import context

export default function Navbar() {
  const navigate = useNavigate();
  const { user, setUser, loading } = useAuth(); // ✅ use context instead of local state

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error(err);
    }
    setUser(null); // ✅ update context
    navigate("/login");
  };

  if (loading) return null; // wait for auth check
  const loggedIn = !!user;

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">CampusGig</Link>
      </div>
      <div className="nav-center">
        <Link to="/jobs">Jobs</Link>
        <Link to="/post-job">Post Job</Link>
        {loggedIn && <Link to="/accepted-jobs">Accepted Jobs</Link>}
        {loggedIn && <Link to="/my-jobs">My Jobs</Link>} {/* ✅ Added link */}
      </div>
      <div className="nav-right">
        {loggedIn && <Link to="/chat">Chat</Link>}
        {loggedIn && <Link to="/profile" className="nav-link">Profile</Link>}
        {!loggedIn ? (
          <>
            <Link to="/login" className="nav-btn">Login</Link>
            <Link to="/signup" className="nav-btn signup-btn">Signup</Link>
          </>
        ) : (
          <button className="nav-btn signup-btn" onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
}
