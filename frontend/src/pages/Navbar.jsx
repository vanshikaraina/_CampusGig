// import { Link, useNavigate } from "react-router-dom";
// import "./AppStyles.css";
// import api from "../services/api";
// import { useAuth } from "../context/AuthContext"; // ✅ import context

// export default function Navbar() {
//   const navigate = useNavigate();
//   const { user, setUser, loading } = useAuth(); // ✅ use context instead of local state

//   const handleLogout = async () => {
//     try {
//       await api.post("/auth/logout");
//     } catch (err) {
//       console.error(err);
//     }
//     setUser(null); // ✅ update context
//     navigate("/login");
//   };

//   if (loading) return null; // wait for auth check
//   const loggedIn = !!user;

//   return (
//     <nav className="navbar">
//       <div className="nav-left">
//         <Link to="/" className="logo">CampusGig</Link>
//       </div>
//       <div className="nav-center">
//         <Link to="/jobs">Jobs</Link>
//         <Link to="/post-job">Post Job</Link>
//         {loggedIn && <Link to="/accepted-jobs">Accepted Jobs</Link>}
//         {loggedIn && <Link to="/my-jobs">My Jobs</Link>} {/* ✅ Added link */}
//         {loggedIn && user?._id && (
//           <Link to={`/portfolio/${user?._id}`} className="nav-link">
//             Portfolio
//           </Link>
//         )}
//       </div>
//       <div className="nav-right">
//         {loggedIn && <Link to="/chat">Chat</Link>}
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
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, setUser, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error(err);
    }
    setUser(null);
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
        {loggedIn && <Link to="/my-jobs">My Jobs</Link>}
      </div>

      <div className="nav-right">
        {loggedIn && <Link to="/chat">Chat</Link>}

        {loggedIn ? (
          <div className="profile-dropdown">
            <span className="profile-text">Profile ▾</span>
            <div className="dropdown-content">
              <Link to="/profile">View Profile</Link>
              
              {/* Only render Portfolio link if user._id exists */}
              {user?._id && <Link to={`/portfolio/${user._id}`}>Portfolio</Link>}
              
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-btn">Login</Link>
            <Link to="/signup" className="nav-btn signup-btn">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}


// import { Link, useNavigate } from "react-router-dom";
// import "./AppStyles.css";
// import api from "../services/api";
// import { useAuth } from "../context/AuthContext";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const { user, setUser, loading } = useAuth();

//   const handleLogout = async () => {
//     try {
//       await api.post("/auth/logout");
//     } catch (err) {
//       console.error(err);
//     }
//     setUser(null);
//     navigate("/login");
//   };

//   if (loading) return null; // wait for auth check
//   const loggedIn = !!user;

//   return (
//     <nav className="navbar">
//       <div className="nav-left">
//         <Link to="/" className="logo">CampusGig</Link>
//       </div>

//       <div className="nav-center">
//         <Link to="/jobs">Jobs</Link>
//         <Link to="/post-job">Post Job</Link>
//         {loggedIn && <Link to="/accepted-jobs">Accepted Jobs</Link>}
//         {loggedIn && <Link to="/my-jobs">My Jobs</Link>}
//       </div>

//       <div className="nav-right">
//         {loggedIn && <Link to="/chat">Chat</Link>}

//         {loggedIn ? (
//           <div className="profile-dropdown">
//             <span className="profile-text">Profile ▾</span>
//             <div className="dropdown-content">
//               <Link to="/profile">View Profile</Link>
//               <Link to={`/portfolio/${user._id}`}>Portfolio</Link>
//               <button onClick={handleLogout} className="logout-btn">
//                 Logout
//               </button>
//             </div>
//           </div>
//         ) : (
//           <>
//             <Link to="/login" className="nav-btn">Login</Link>
//             <Link to="/signup" className="nav-btn signup-btn">Signup</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }
