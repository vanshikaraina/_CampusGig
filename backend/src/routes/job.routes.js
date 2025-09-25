import express from "express";
import Job from "../models/Jobs.js";
import AssignedJob from "../models/AssignedJob.js";
import { auth } from "../middleware/auth.middleware.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// ------------------- Create a Job -------------------
router.post("/", auth, async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      postedBy: req.user._id
    });
    await job.save();

    // Increment user's jobsPosted
    await User.findByIdAndUpdate(req.user._id, { $inc: { jobsPosted: 1 } });

    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ------------------- GET all jobs (unaccepted, optional search/filter) -------------------
router.get("/", async (req, res) => {
  try {
    const { search, role } = req.query;
    let filter = { acceptedBy: null }; // ✅ Only unaccepted jobs

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (role && role !== "") {
      filter.category = { $regex: role, $options: "i" };
    }

    const jobs = await Job.find(filter).populate("postedBy", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- Accept Job -------------------
router.put("/:id/accept", auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.acceptedBy) return res.status(400).json({ message: "Job already accepted" });

    job.acceptedBy = req.user._id;
    await job.save();

    const assigned = await AssignedJob.create({
      job: job._id,
      student: req.user._id,
      jobTitle: job.title,
      studentName: req.user.name,
      studentEmail: req.user.email,
      status: "accepted", // ✅ updated enum
      rating: null,
      review: null
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { jobsAccepted: 1 } });

    res.json({ message: "Job accepted", job, assigned });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- Mark Job Completed -------------------
router.put("/:id/complete", auth, async (req, res) => {
  try {
    const assignedJob = await AssignedJob.findById(req.params.id);
    if (!assignedJob) return res.status(404).json({ message: "Assigned job not found" });
    if (assignedJob.status !== "accepted")
      return res.status(400).json({ message: "Only accepted jobs can be completed" });

    assignedJob.status = "completed"; // ✅ update status
    await assignedJob.save();

    res.json({ message: "Job marked as completed", assignedJob });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- Rate Completed Job -------------------
router.post("/:id/rate", auth, async (req, res) => {
  try {
    const { rating, review } = req.body;

    const assignedJob = await AssignedJob.findById(req.params.id);
    if (!assignedJob) return res.status(404).json({ message: "Job not found" });
    if (assignedJob.status !== "completed")
      return res.status(400).json({ message: "Job not completed yet" });

    // Update assigned job
    assignedJob.rating = rating;
    assignedJob.review = review;
    assignedJob.status = "rated";
    await assignedJob.save();

    // Update freelancer's ratings
    const user = await User.findById(assignedJob.student);
    if (user) {
      // Ensure ratings array exists
      user.ratings = user.ratings || [];
      user.ratings.push(rating);  // Add new rating
      user.rating = user.ratings.reduce((a, b) => a + b, 0) / user.ratings.length; // Average
      await user.save();
    }

    res.json({ message: "Rating submitted", assignedJob });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ------------------- Get Accepted Jobs for Current User -------------------
router.get("/accepted", auth, async (req, res) => {
  try {
    const acceptedJobs = await AssignedJob.find({
      student: req.user._id,
      status: { $in: ["accepted", "completed", "rated"] } // ✅ status filter
    })
      .populate({ path: "job", populate: { path: "postedBy", select: "name email" } })
      .populate("student", "name email")
      .sort({ assignedAt: -1 });

    res.json(acceptedJobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- Get Jobs Posted by Current User -------------------
router.get("/my", auth, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).populate("acceptedBy", "name email").lean();

    const jobIds = jobs.map(j => j._id);
    const assigned = await AssignedJob.find({ job: { $in: jobIds } }).populate("student", "name email").lean();

    const jobsWithStatus = jobs.map(job => {
      const assignedEntry = assigned.find(a => (a.job?._id || a.job).toString() === job._id.toString());
      return {
        ...job,
        status: assignedEntry?.status || "pending",
        acceptedBy: assignedEntry ? assignedEntry.student : null,
        assignedJobId: assignedEntry?._id,
        rating: assignedEntry?.rating || null,
        review: assignedEntry?.review || null
      };
    });

    res.json(jobsWithStatus);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();

    // Count accepted jobs
    const acceptedJobsCount = await AssignedJob.countDocuments({
      student: req.user._id,
      status: { $in: ["accepted", "completed", "rated"] }
    });

    res.json({
      user: {
        ...user,
        jobsAccepted: acceptedJobsCount
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
