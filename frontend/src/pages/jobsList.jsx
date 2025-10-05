// import { useEffect, useState } from "react";
// import api from "../services/api";
// import "./AppStyles.css";

// export default function JobsList({ setUser }) {  // ✅ accept setUser prop
//   const [jobs, setJobs] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [search, setSearch] = useState("");
//   const [roleFilter, setRoleFilter] = useState("");
//   const [tick, setTick] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTick((prev) => prev + 1); // force re-render every 60s
//     }, 60000); // 60,000ms = 1 min

//     return () => clearInterval(interval); // cleanup
//   }, []);


//   // Fetch jobs whenever search or roleFilter changes
//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const res = await api.get("/jobs", {
//           params: {
//             search: search,
//             role: roleFilter,
//           },
//         });
//         setJobs(res.data);

//         // Collect unique categories dynamically
//         const uniqueCategories = [
//           ...new Set(res.data.map((job) => job.category?.toLowerCase())),
//         ];
//         setCategories(uniqueCategories);
//       } catch (err) {
//         console.error("Error fetching jobs:", err);
//       }
//     };
//     fetchJobs();
//   }, [search, roleFilter]);

//   const handleAccept = async (jobId) => {
//     try {
//       await api.put(`/jobs/${jobId}/accept`);

//       // Remove the accepted job instantly
//       setJobs((prev) => prev.filter((job) => job._id !== jobId));

//       // ✅ Update user after accepting job
//       if (setUser) {
//         const userRes = await api.get("/auth/me", { withCredentials: true });
//         setUser(userRes.data.user);
//       }

//       alert("Job accepted successfully!");
//     } catch (err) {
//       console.error("Error accepting job:", err.response?.data || err.message);
//       alert(
//         `Failed to accept job: ${err.response?.data?.message || err.message}`
//       );
//     }
//   };

//   const handlePass = async (jobId) => {
//     try {
//       await api.post(`/jobs/${jobId}/pass`);
//       setJobs((prev) => prev.filter((job) => job._id !== jobId));
//       alert("You passed this job.");
//     } catch (err) {
//       console.error("Error passing job:", err.response?.data || err.message);
//       alert(
//         `Failed to pass job: ${err.response?.data?.message || err.message}`
//       );
//     }
//   };

//     const timeLeft = (deadline) => {
//     if (!deadline) return "No deadline";

//     const now = new Date();
//     const end = new Date(deadline);
//     const diffMs = end - now;

//     if (diffMs <= 0) return "Expired";

//     const seconds = Math.floor(diffMs / 1000);
//     const minutes = Math.floor(seconds / 60);
//     const hours = Math.floor(minutes / 60);
//     const days = Math.floor(hours / 24);

//     if (days > 0) return `${days}d left`;
//     if (hours > 0) return `${hours}h left`;
//     if (minutes > 0) return `${minutes}m left`;
//     return "Less than a minute left";
//   };

//   return (
//     <div className="jobs-list">
//       <h2>Available Jobs</h2>

//       {/* Search + Filter */}
//       <div className="jobs-filters">
//         <input
//           type="text"
//           placeholder="Search jobs..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="nav-search"
//         />

//         <select
//           value={roleFilter}
//           onChange={(e) => setRoleFilter(e.target.value)}
//           className="nav-filter"
//         >
//           <option value="">All Roles</option>
//           {categories.map((cat, index) => (
//             <option key={index} value={cat}>
//               {cat.charAt(0).toUpperCase() + cat.slice(1)}
//             </option>
//           ))}
//         </select>
//       </div>

//       {jobs.length === 0 ? (
//         <p>No jobs posted yet.</p>
//       ) : (
//         <ul>
//           {jobs.map((job) => (
//             <li key={job._id} className="job-card">
//               <span className="job-time">{timeLeft(job.deadline)}</span>
//               <h3>{job.title}</h3>
//               <p>{job.description}</p>
//               <p>
//                 <strong>Category:</strong> {job.category}
//               </p>
//               <p>
//                 <strong>Pay:</strong> ₹{job.price}
//               </p>
//               <p>
//                 <strong>Deadline:</strong>{" "}
//                 {job.deadline ? new Date(job.deadline).toLocaleDateString() : "No deadline"}
//               </p>
//               <p>
//                 <strong>Posted by:</strong> {job.postedBy?.name || "Anonymous"}
//               </p>

//               <div className="job-actions">
//                 <button onClick={() => handleAccept(job._id)}>Accept</button>
//                 <button onClick={() => handlePass(job._id)}>Pass</button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// src/pages/JobsList.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import "./AppStyles.css";

export default function JobsList({ setUser }) {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1); // force re-render every 60s
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Fetch jobs whenever search or roleFilter changes
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs", {
          params: { search, role: roleFilter },
        });
        setJobs(res.data);

        const uniqueCategories = [
          ...new Set(res.data.map((job) => job.category?.toLowerCase())),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, [search, roleFilter]);

  // Accept job directly
  // const handleAccept = async (jobId) => {
  //   try {
  //     await api.put(`/jobs/${jobId}/accept`);

  //     setJobs((prev) => prev.filter((job) => job._id !== jobId));

  //     if (setUser) {
  //       const userRes = await api.get("/auth/me", { withCredentials: true });
  //       setUser(userRes.data.user);
  //     }

  //     alert("Job accepted successfully!");
  //   } catch (err) {
  //     console.error("Error accepting job:", err.response?.data || err.message);
  //     alert(
  //       `Failed to accept job: ${err.response?.data?.message || err.message}`
  //     );
  //   }
  // };

  // Place a bid
  const handleBid = async (jobId) => {
    const bidAmount = prompt("Enter your bid amount (₹):");
    if (!bidAmount) return;

    try {
      await api.post(`/jobs/${jobId}/bid`, { bidAmount });

      if (setUser) {
        const userRes = await api.get("/auth/me", { withCredentials: true });
        setUser(userRes.data.user);
      }

      alert("Bid placed successfully!");
    } catch (err) {
      console.error("Error bidding:", err.response?.data || err.message);
      alert(`Failed to place bid: ${err.response?.data?.message || err.message}`);
    }
  };

  // Pass a job
  const handlePass = async (jobId) => {
    try {
      await api.post(`/jobs/${jobId}/pass`);
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      alert("You passed this job.");
    } catch (err) {
      console.error("Error passing job:", err.response?.data || err.message);
      alert(`Failed to pass job: ${err.response?.data?.message || err.message}`);
    }
  };

  const timeLeft = (deadline) => {
    if (!deadline) return "No deadline";

    const now = new Date();
    const end = new Date(deadline);
    const diffMs = end - now;

    if (diffMs <= 0) return "Expired";

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d left`;
    if (hours > 0) return `${hours}h left`;
    if (minutes > 0) return `${minutes}m left`;
    return "Less than a minute left";
  };

  return (
    <div className="jobs-list">
      <h2>Available Jobs</h2>

      {/* Search + Filter */}
      <div className="jobs-filters">
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="nav-search"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="nav-filter"
        >
          <option value="">All Roles</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job._id} className="job-card">
              <span className="job-time">{timeLeft(job.deadline)}</span>
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p>
                <strong>Category:</strong> {job.category}
              </p>
              <p>
                <strong>Pay:</strong> ₹{job.price}
              </p>
              <p>
                <strong>Deadline:</strong>{" "}
                {job.deadline ? new Date(job.deadline).toLocaleDateString() : "No deadline"}
              </p>
              <p>
                <strong>Posted by:</strong> {job.postedBy?.name || "Anonymous"}
              </p>

              <div className="job-actions">
                {/* <button onClick={() => handleAccept(job._id)}>Accept</button> */}
                <button onClick={() => handleBid(job._id)}>Place Bid</button>
                <button onClick={() => handlePass(job._id)}>Pass</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
