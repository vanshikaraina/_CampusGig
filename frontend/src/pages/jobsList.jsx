// import { useEffect, useState } from "react";
// import api from "../services/api";
// import "./AppStyles.css";

// export default function JobsList({ setUser }) {
//   const [jobs, setJobs] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [search, setSearch] = useState("");
//   const [roleFilter, setRoleFilter] = useState("");
//   const [tick, setTick] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTick((prev) => prev + 1); // force re-render every 60s
//     }, 60000);

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const res = await api.get("/jobs", {
//           params: { search, role: roleFilter },
//         });
//         setJobs(res.data);

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

//   const handleBid = async (jobId) => {
//     const bidAmount = prompt("Enter your bid amount (₹):");
//     if (!bidAmount) return;

//     try {
//       await api.post(`/jobs/${jobId}/bid`, { bidAmount });

//       if (setUser) {
//         const userRes = await api.get("/auth/me", { withCredentials: true });
//         setUser(userRes.data.user);
//       }

//       alert("Bid placed successfully!");
//     } catch (err) {
//       console.error("Error bidding:", err.response?.data || err.message);
//       alert(`Failed to place bid: ${err.response?.data?.message || err.message}`);
//     }
//   };

//   const handlePass = async (jobId) => {
//     try {
//       await api.post(`/jobs/${jobId}/pass`);
//       setJobs((prev) => prev.filter((job) => job._id !== jobId));
//       alert("You passed this job.");
//     } catch (err) {
//       console.error("Error passing job:", err.response?.data || err.message);
//       alert(`Failed to pass job: ${err.response?.data?.message || err.message}`);
//     }
//   };

//   const timeLeft = (deadline) => {
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

//   // ✅ Filter out expired jobs before rendering
//   const validJobs = jobs.filter((job) => {
//     if (!job.deadline) return true; // show jobs with no deadline
//     return new Date(job.deadline) > new Date();
//   });

//   return (
//     <div className="jobs-list">
//       <h2>Available Jobs</h2>

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

//       {validJobs.length === 0 ? (
//         <p>No available (non-expired) jobs right now.</p>
//       ) : (
//         <ul>
//           {validJobs.map((job) => (
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
//                 {job.deadline
//                   ? new Date(job.deadline).toLocaleDateString()
//                   : "No deadline"}
//               </p>
//               <p>
//                 <strong>Posted by:</strong> {job.postedBy?.name || "Anonymous"}
//               </p>

//               <div className="job-actions">
//                 <button onClick={() => handleBid(job._id)}>Place Bid</button>
//                 <button onClick={() => handlePass(job._id)}>Pass</button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import api from "../services/api";
import "./AppStyles.css";

export default function JobsList({ user, setUser }) {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [tick, setTick] = useState(0);
  const [currentUser, setCurrentUser] = useState(user || null);

  // Force re-render every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch jobs
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

  // Fetch current user if not provided
  useEffect(() => {
    const fetchUser = async () => {
      if (!currentUser) {
        try {
          const res = await api.get("/auth/me", { withCredentials: true });
          const userData = res.data.user;
          // ensure skills exists
          if (!userData.skills) userData.skills = [];
          setCurrentUser(userData);
          if (setUser) setUser(userData);
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      }
    };
    fetchUser();
  }, [currentUser, setUser]);

  const handleBid = async (jobId) => {
    const bidAmount = prompt("Enter your bid amount (₹):");
    if (!bidAmount) return;

    try {
      await api.post(`/jobs/${jobId}/bid`, { bidAmount });
      // refresh user
      const res = await api.get("/auth/me", { withCredentials: true });
      setCurrentUser(res.data.user);
      if (setUser) setUser(res.data.user);

      alert("Bid placed successfully!");
    } catch (err) {
      console.error("Error bidding:", err.response?.data || err.message);
      alert(`Failed to place bid: ${err.response?.data?.message || err.message}`);
    }
  };

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

  // Filter out expired jobs
  const validJobs = jobs.filter((job) => !job.deadline || new Date(job.deadline) > new Date());

  // Normalize skills
  const normalizeSkill = (skill) =>
    skill.toLowerCase().trim().replace(/[^a-z0-9]/g, "");

  // Recommended jobs
  const recommendedJobs =
    currentUser?.skills?.length > 0
      ? validJobs.filter((job) => {
        if (!job?.skills?.length) return false;
        const userSkills = currentUser.skills.map(normalizeSkill);
        const jobSkills = job.skills.map(normalizeSkill);
        // only exact matches
        return jobSkills.some((js) => userSkills.includes(js));
      })
      : [];
      
  // Other jobs
  const allJobs = validJobs.filter((job) => !recommendedJobs.includes(job));

  const renderJobCard = (job) => (
    <li key={job._id} className="job-card">
      <span className="job-time">{timeLeft(job.deadline)}</span>
      <h3>{job.title}</h3>
      <p>{job.description}</p>
      <p>
        <strong>Category:</strong> {job.category}
      </p>
      <p>
        <strong>Skills:</strong>{" "}
        {job.skills && job.skills.length > 0 ? job.skills.join(", ") : "None"}
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
        <button onClick={() => handleBid(job._id)}>Place Bid</button>
        <button onClick={() => handlePass(job._id)}>Pass</button>
      </div>
    </li>
  );

  return (
    <div className="jobs-list">
      <h2>Recommended Jobs</h2>
      {recommendedJobs.length === 0 ? (
        <p>No recommended jobs based on your skills.</p>
      ) : (
        <ul>{recommendedJobs.map(renderJobCard)}</ul>
      )}

      <h2>All Jobs</h2>
      {allJobs.length === 0 ? (
        <p>No other jobs available right now.</p>
      ) : (
        <ul>{allJobs.map(renderJobCard)}</ul>
      )}
    </div>
  );
}
