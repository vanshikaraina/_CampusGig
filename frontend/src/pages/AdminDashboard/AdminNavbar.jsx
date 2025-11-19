// // frontend/pages/AdminDashboard/AdminNavbar.jsx
// import React from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

// const AdminNavbar = () => {
//   const { user } = useAuth();

//   return (
//     <nav style={{ padding: "10px 20px", background: "#1e90ff", color: "white", display: "flex", justifyContent: "space-between" }}>
//       <div>
//         <Link to="/admin/dashboard" style={{ color: "white", fontWeight: "bold", marginRight: "20px" }}>
//           CampusGig Admin
//         </Link>
//         <Link to="/admin/dashboard/users" style={{ color: "white", marginRight: "10px" }}>
//           Users
//         </Link>
//         <Link to="/admin/dashboard/jobs" style={{ color: "white" }}>
//           Jobs
//         </Link>
//       </div>
//       <div>
//         {user?.name} ({user?.role})
//       </div>
//     </nav>
//   );
// };

// export default AdminNavbar;
