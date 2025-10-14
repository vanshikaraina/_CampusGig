// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";
import { FaGithub, FaLinkedin, FaEnvelope, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import Lottie from "lottie-react";
import ProfilePicSelector, { avatarsMap } from "../components/ProfilePicSelector";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [showSelector, setShowSelector] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newTask, setNewTask] = useState({ title: "", status: "" });
  // const [newPortfolio, setNewPortfolio] = useState({ title: "", link: "", file: null });
  const [portfolioProjects, setPortfolioProjects] = useState([]);

  useEffect(() => {
    if (!user?._id) return;
    axios
      .get(`http://localhost:5000/api/portfolio/${user._id}`)
      .then((res) => setPortfolioProjects(res.data.projects || []))
      .catch((err) => console.error("Error fetching portfolio:", err));
  }, [user]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/me", { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setProfilePic(res.data.user.profilePic || null); // ✅ initialize profilePic
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load the profile");
        setLoading(false);
      });
  }, []);

  const pieData = [
    { name: "Jobs Posted", value: user?.jobsPosted || 0 },
    { name: "Jobs Accepted", value: user?.jobsAccepted || 0 },
  ];

  const COLORS = ["#0088FE", "#00C49F"];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name.startsWith("contacts.")) {
      const key = name.split(".")[1];
      setUser({ ...user, contacts: { ...user.contacts, [key]: value } || { [key]: value } });
    // } else if (name === "portfolioFile") {
    //   setNewPortfolio({ ...newPortfolio, file: files[0] });
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  // Add skill
  const addSkill = () => {
    if (!newSkill.trim()) return;
    setUser({ ...user, skills: [...(user.skills || []), newSkill] });
    setNewSkill("");
  };

  const removeSkill = (idx) => {
    setUser({ ...user, skills: user.skills.filter((_, i) => i !== idx) });
  };

  // Add campus gig
  const addTask = () => {
    if (!newTask.title.trim()) return;
    setUser({ ...user, tasksDone: [...(user.tasksDone || []), newTask] });
    setNewTask({ title: "", status: "" });
  };

  const removeTask = (idx) => {
    setUser({ ...user, tasksDone: user.tasksDone.filter((_, i) => i !== idx) });
  };

  // Add portfolio
  // const addPortfolio = () => {
  //   if (!newPortfolio.title || (!newPortfolio.link && !newPortfolio.file)) return;

  //   const portfolioItem = {
  //     title: newPortfolio.title,
  //     link: newPortfolio.link || URL.createObjectURL(newPortfolio.file),
  //     fileName: newPortfolio.file?.name || null,
  //   };

  //   setUser({ ...user, portfolio: [...(user.portfolio || []), portfolioItem] });
  //   setNewPortfolio({ title: "", link: "", file: null });
  // };

  // const removePortfolio = (idx) => {
  //   setUser({ ...user, portfolio: user.portfolio.filter((_, i) => i !== idx) });
  // };

  const saveProfile = () => {
    // ensure profilePic is string
    const payload = {
      ...user,
      profilePic: profilePic || "",
      tasksDone: user.tasksDone || [],
      portfolio: user.portfolio || [],
      skills: user.skills || [],
      contacts: { ...(user.contacts || {}) }// <- no overwriting,
    };

    axios
      .put("http://localhost:5000/api/auth/me", payload, { withCredentials: true })
      .then((res) => {
        setUser(res.data.user || res.data);
        setProfilePic(res.data.user?.profilePic || res.data?.profilePic || null);
        setEditMode(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to update profile");
      });
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return null;

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-pic-wrapper">
          {profilePic ? (
            <Lottie
              animationData={avatarsMap[profilePic]}
              loop
              style={{ height: 120 }}
            />
          ) : (
            <img
              src="https://static.vecteezy.com/system/resources/previews/036/280/650/large_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg"
              alt="Profile"
              className="profile-pic"
            />
          )}


          {/* Show avatar edit only in edit mode */}
          {editMode && (
            <button
              className="edit-btn"
              onClick={() => setShowSelector(!showSelector)}
            >
              <FaEdit />
            </button>
          )}
        </div>

        {editMode ? (
          <form
            className="profile-edit-form"
            onSubmit={(e) => {
              e.preventDefault();
              saveProfile();
            }}
          >
            {/* Avatar Picker */}
            {editMode && showSelector && (
              <ProfilePicSelector
                onSelect={(id) => {
                  setProfilePic(id); // store selected avatar ID
                  setUser({ ...user, profilePic: id });
                  setShowSelector(false);
                }}
              />
            )}
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={user.name || ""}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="branch">Branch</label>
              <input
                type="text"
                id="branch"
                name="branch"
                value={user.branch || ""}
                onChange={handleChange}
                placeholder="Enter your branch (e.g., CSE, 3rd Year)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="college">College</label>
              <input
                type="text"
                id="college"
                name="college"
                value={user.college || ""}
                onChange={handleChange}
                placeholder="Enter your college name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={user.bio || ""}
                onChange={handleChange}
                placeholder="Write a short bio about yourself"
              />
            </div>


            {/* Skills */}
            <div className="form-group">
              <label>Skills</label>
              <div className="skills-edit">
                {(user.skills || []).map((s, idx) => (
                  <span key={idx} className="skill-tag">
                    {s} <FaTrash onClick={() => removeSkill(idx)} />
                  </span>
                ))}
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                />
                <button type="button" onClick={addSkill}>
                  <FaPlus />
                </button>
              </div>
            </div>

            {/* Campus Gigs */}
            <div className="form-group">
              <label>Campus Gigs</label>
              <ul>
                {(user.tasksDone || []).map((t, idx) => (
                  <li key={idx}>
                    {t.title} - {t.status} <FaTrash onClick={() => removeTask(idx)} />
                  </li>
                ))}
              </ul>
              <input
                type="text"
                placeholder="Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="Status"
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              />
              <button type="button" onClick={addTask}>
                Add Task
              </button>
            </div>

            {/* Portfolio */}
            {/* <div className="form-group">
              <label>Portfolio</label>
              <ul>
                {(user.portfolio || []).map((p, idx) => (
                  <li key={idx}>
                    <a href={p.link} target="_blank" rel="noreferrer">
                      {p.title}
                    </a>{" "}
                    <FaTrash onClick={() => removePortfolio(idx)} />
                  </li>
                ))}
              </ul>
              <input
                type="text"
                placeholder="Project Title"
                value={newPortfolio.title}
                onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="Link (optional)"
                value={newPortfolio.link}
                onChange={(e) => setNewPortfolio({ ...newPortfolio, link: e.target.value })}
              />
              <input type="file" name="portfolioFile" onChange={handleChange} />
              <button type="button" onClick={addPortfolio}>
                Add Portfolio
              </button>
            </div> */}
            {/* Portfolio Section */}
{/* Portfolio Section */}
<div className="profile-section">
  <h3>Portfolio</h3>

  {/* Message above portfolios */}
  <p style={{ marginBottom: "1rem", color: "#555" ,  fontSize: "0.8rem" }}>
    To add a new portfolio, please navigate to the Portfolio Page.
  </p>

  {/* Portfolio grid */}
  <div className="portfolio-grid">
    {portfolioProjects.length > 0 ? (
      portfolioProjects.map((proj, idx) => (
        <a
          key={idx}
          href={proj.link || `http://localhost:5000${proj.fileUrl}`}
          target="_blank"
          rel="noreferrer"
          className="portfolio-card"
        >
          <p>{proj.title}</p>
        </a>
      ))
    ) : (
      <p>No portfolio added yet.</p>
    )}
  </div>
</div>

            {/* Contacts */}
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="contacts.phone"
                value={user.contacts?.phone || ""}
                onChange={handleChange}
                placeholder="Phone Number"
              />
              <label>GitHub</label>
              <input
                type="text"
                name="contacts.github"
                value={user.contacts?.github || ""}
                onChange={handleChange}
                placeholder="GitHub profile link"
              />
              <label>LinkedIn</label>
              <input
                type="text"
                name="contacts.linkedin"
                value={user.contacts?.linkedin || ""}
                onChange={handleChange}
                placeholder="LinkedIn profile link"
              />
              <label>Email</label>
              <input
                type="email"
                name="contacts.email"
                value={user.contacts?.email || ""}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>


            <div className="form-buttons">
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2>{user.name || "Your Name"}</h2>
            <p>
              {user.branch || "Branch"} | {user.college || "Chitkara Univeristy"}
            </p>
            <p className="bio">{user.bio || "Your bio goes here..."}</p>
            <button onClick={() => setEditMode(true)}>Edit Profile</button>
          </>
        )}
      </div>
      <div className="profile-stats">
        <div className="stat-card">
          <h3>{user.jobsPosted || 0}</h3>
          <p>Jobs Posted</p>
        </div>
        <div className="stat-card">
          <h3>{user.jobsAccepted || 0}</h3>
          <p>Jobs Accepted</p>
        </div>
        <div className="stat-card">
          <h3>₹{user.earnings || 0}</h3>
          <p>Total Earnings</p>
        </div>
        <div className="stat-card">
          <h3>{typeof user.rating === "number" ? user.rating.toFixed(1) : "—"}⭐</h3>
          <p>Rating</p>
        </div>
      </div>

      {/* ✅ Pie Chart Section */}
      <div className="profile-section">
        <h3>Profile Insights</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Skills */}
      <div className="profile-section">
        <h3>Skills</h3>
        <div className="skills-list">
          {user.skills && user.skills.length > 0
            ? user.skills.map((skill, idx) => (
              <span key={idx} className="skill-tag">
                {skill}
              </span>
            ))
            : "No skills added yet"}
        </div>
      </div>

      {/* Tasks */}
      <div className="profile-section">
        <h3>Campus Gigs Completed</h3>
        <ul className="task-list">
          {user.tasksDone && user.tasksDone.length > 0
            ? user.tasksDone.map((task, idx) => (
              <li key={idx}>
                {task.title} - <b>{task.status}</b>
              </li>
            ))
            : "No tasks completed yet"}
        </ul>
      </div>

      {/* Portfolio */}
      <div className="profile-section">
        <h3>Portfolio</h3>
        <div className="portfolio-grid">
          {portfolioProjects.length > 0 ? (
            portfolioProjects.map((proj, idx) => (
              <a
                key={idx}
                href={proj.link || `http://localhost:5000${proj.fileUrl}`}
                target="_blank"
                rel="noreferrer"
                className="portfolio-card"
              >
                <p>{proj.title}</p>
              </a>
            ))
          ) : (
            <p>No portfolio added yet.</p>
          )}
        </div>
      </div>

      {/* Contact */}
      <div className="profile-section contacts">
        <h3>Contact</h3>

        <div className="contacts-row">
          {user.contacts?.phone && <p>{user.contacts.phone}</p>}

          <div className="contacts-icons">
            {user.contacts?.github && (
              <a
                href={
                  user.contacts.github.startsWith("http")
                    ? user.contacts.github
                    : `https://${user.contacts.github}`
                }
                target="_blank"
                rel="noreferrer"
                title="GitHub"
              >
                <FaGithub size={24} />
              </a>
            )}

            {user.contacts?.linkedin && (
              <a
                href={
                  user.contacts.linkedin.startsWith("http")
                    ? user.contacts.linkedin
                    : `https://${user.contacts.linkedin}`
                }
                target="_blank"
                rel="noreferrer"
                title="LinkedIn"
              >
                <FaLinkedin size={24} />
              </a>
            )}

            {user.contacts?.email && (
              <a href={`mailto:${user.contacts.email}`} title="Email">
                <FaEnvelope size={24} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
