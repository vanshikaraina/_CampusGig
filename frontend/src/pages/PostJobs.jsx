import { useState } from "react";
import axios from "axios"; // for fetching user
import api from "../services/api"; // axios instance (withCredentials: true)
import "./AppStyles.css";

export default function PostJob({ setUser }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    deadline: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Fetch current logged-in user
  const fetchUser = async () => {
    const res = await axios.get("http://localhost:5000/api/auth/me", {
      withCredentials: true,
    });
    return res.data.user;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Post the job
      await api.post("/jobs", form);

      alert("Job posted successfully!");
      setForm({
        title: "",
        description: "",
        category: "",
        price: "",
        deadline: "",
      });

      // Update user in Profile
// Replace this in handleSubmit
    const updatedUser = await fetchUser();
    if (setUser) setUser(updatedUser); // only call if setUser exists

    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        alert("You must be logged in to post a job");
      } else {
        alert(err.response?.data?.error || "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="post-job-container">
      <h2 className="post-job-title">Post a Job</h2>
      <form className="post-job-form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          name="category"
          placeholder="Category (e.g. Coding, Design)"
          value={form.category}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          required
        />
        <button type="submit" className="post-job-btn">
          Post Job
        </button>
      </form>
    </div>
  );
}
