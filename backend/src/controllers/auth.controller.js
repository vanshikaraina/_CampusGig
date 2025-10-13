
// //auth.controller.js
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import AssignedJob from "../models/AssignedJob.js";
// import Job from "../models/Jobs.js";

// // Generate JWT and set cookie
// const generateToken = (res, userId) => {
//   const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
//     expiresIn: "7d", // token expiry
//   });

//   // Set token in HTTP-only cookie
//   res.cookie("token", token, {
//     httpOnly: true,
//     // secure: process.env.NODE_ENV === "production", // HTTPS only in production
//     secure:true,
//     // sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
//     sameSite: "none", 
//     maxAge: 24 * 60 * 60 * 1000, // 7 days
//   });
// };

// // Signup
// export const signup = async (req, res) => {
//   try {
//     const { name, email, password, role, collegeId } = req.body;

//     const exists = await User.findOne({ email });
//     if (exists) return res.status(400).json({ message: "User already exists" });

//     const hashed = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       name,
//       email,
//       password: hashed,
//       role,
//       collegeId,
//     });

//     // set cookie
//     generateToken(res, user._id);

//     res.status(201).json({
//       message: "User created",
//       user: { id: user._id, email: user.email, role: user.role },
//     });
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// };

// // Login
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok) return res.status(400).json({ message: "Invalid credentials" });

//     // set cookie
//     generateToken(res, user._id);

//     res.json({
//       message: "Login successful",
//       user: { id: user._id, name: user.name, role: user.role },
//     });
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// };

// // Get current user + stats
// export const me = async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: "Unauthorized" });

//     // Fetch full user from DB
//     const user = await User.findById(req.user._id).lean();
//     if (!user) return res.status(404).json({ message: "User not found" });

//         // ensure skills field exists
//     if (!user.skills) user.skills = [];

//     // 1️⃣ Jobs where this student has been rated
//     const jobs = await AssignedJob.find({ student: user._id, rating: { $ne: null } });

//     // 2️⃣ Calculate average rating
//     let avgRating = 0;
//     if (jobs.length > 0) {
//       const total = jobs.reduce((acc, j) => acc + Number(j.rating), 0); // convert to number
//       avgRating = total / jobs.length;
//     }

//     // 3️⃣ Other stats
//     const jobsPosted = await Job.countDocuments({ postedBy: user._id });
//     const jobsAccepted = await AssignedJob.countDocuments({ student: user._id });

//     const earningsAgg = await AssignedJob.aggregate([
//       { $match: { student: user._id } },
//       { $lookup: { from: "jobs", localField: "job", foreignField: "_id", as: "job" } },
//       { $unwind: "$job" },
//       { $group: { _id: null, total: { $sum: "$job.price" } } },
//     ]);
//     const earnings = earningsAgg[0]?.total || 0;

//     // 4️⃣ Send response with stats
//     res.json({
//       user,
//       jobsPosted,
//       jobsAccepted,
//       earnings,
//       rating: Number(avgRating.toFixed(1)), // numeric with 1 decimal
//     });
//   } catch (e) {
//     console.error("Me error:", e.message);
//     res.status(500).json({ error: e.message });
//   }
// };


// // Update profile (requires auth middleware)
// export const updateProfile = async (req, res) => {
//   try {
//     console.log("req.user:", req.user);   // Log user coming from auth middleware
//     console.log("req.body:", req.body);   // Log payload from frontend

//     if (!req.user) return res.status(401).json({ message: "Unauthorized" });

//     //update user in db
//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       req.body,
//       { new: true, runValidators: true } // also good to enforce schema
//     ).select("-password");

//     console.log("updatedUser:", updatedUser);

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(updatedUser);
//   } catch (e) {
//     console.error("Update profile error:", e); // ✅ log error
//     res.status(500).json({ error: e.message });
//   }
// };

// //logout
// export const logout = (req, res) => {
//   // res.clearCookie("token"); // clear cookie set at login
//   res.clearCookie("token", {
//   httpOnly: true,
//   secure: true,
//   sameSite: "none",  // must match cookie settings
// });

//   res.status(200).json({ message: "Logged out successfully" });
// };
// auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AssignedJob from "../models/AssignedJob.js";
import Job from "../models/Jobs.js";

// Generate JWT and set cookie
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, collegeId } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      collegeId,
    });

    generateToken(res, user._id);

    res.status(201).json({
      message: "User created",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        skills: user.skills || [], // ✅ ensure skills always exists
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    generateToken(res, user._id);

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        skills: user.skills || [], // ✅ ensure skills always exists
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Get current user + stats
export const me = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user._id).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.skills) user.skills = []; // ✅ fix undefined skills

    const jobs = await AssignedJob.find({ student: user._id, rating: { $ne: null } });

    let avgRating = 0;
    if (jobs.length > 0) {
      const total = jobs.reduce((acc, j) => acc + Number(j.rating), 0);
      avgRating = total / jobs.length;
    }

    const jobsPosted = await Job.countDocuments({ postedBy: user._id });
    const jobsAccepted = await AssignedJob.countDocuments({ student: user._id });

    const earningsAgg = await AssignedJob.aggregate([
      { $match: { student: user._id } },
      { $lookup: { from: "jobs", localField: "job", foreignField: "_id", as: "job" } },
      { $unwind: "$job" },
      { $group: { _id: null, total: { $sum: "$job.price" } } },
    ]);
    const earnings = earningsAgg[0]?.total || 0;

    res.json({
      user: {
        ...user,
        skills: user.skills || [], // ✅ ensure skills always exists
      },
      jobsPosted,
      jobsAccepted,
      earnings,
      rating: Number(avgRating.toFixed(1)),
    });
  } catch (e) {
    console.error("Me error:", e.message);
    res.status(500).json({ error: e.message });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({
      ...updatedUser.toObject(),
      skills: updatedUser.skills || [], // ✅ ensure skills always exists
    });
  } catch (e) {
    console.error("Update profile error:", e);
    res.status(500).json({ error: e.message });
  }
};

// Logout
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
