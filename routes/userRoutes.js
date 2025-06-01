// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const User = require("../models/User");

// const router = express.Router();
// import express from "express";
// import multer from "multer";
// import path from "path";
// import User from "../models/User.js";

// const router = express.Router();

// // Configure Multer for image uploads
// const storage = multer.diskStorage({
//   destination: "./uploads/",
//   filename: (req, file, cb) => {
//     cb(null, `${req.params.id}_${Date.now()}${path.extname(file.originalname)}`);
//   },
// });
// const upload = multer({ storage });

// // 📌 Route 1: Get User Data by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // 📌 Route 2: Upload & Update Profile Image
// router.put("/:id/upload", upload.single("profileImage"), async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     user.profileImage = `/uploads/${req.file.filename}`;
//     await user.save();

//     res.json({ message: "Profile image updated!", profileImage: user.profileImage });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });
// export default router;

// module.exports = router;


// const express = require("express");
// const User = require("../models/User");
// const multer = require("multer");
// const path = require("path");

// const router = express.Router();

// // Configure Multer for image uploads
// const storage = multer.diskStorage({
//   destination: "./uploads/",
//   filename: (req, file, cb) => {
//     cb(null, `${req.params.id}_${Date.now()}${path.extname(file.originalname)}`);
//   },
// });
// const upload = multer({ storage });

// // Get user data by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Update Profile Image
// router.put("/:id/upload", upload.single("profileImage"), async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     user.profileImage = `/uploads/${req.file.filename}`;
//     await user.save();

//     res.json({ message: "Profile image updated!", profileImage: user.profileImage });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

//Old
import express from "express";
import User from "../models/User.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${req.params.id}_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// 🟢 Get user data by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🟢 Update Profile Image
router.put("/:id/upload", upload.single("profileImage"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profileImage = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ message: "Profile image updated!", profileImage: user.profileImage });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router; 
//New
// import express from "express";
// import User from "../models/User.js";
// import multer from "multer";
// import path from "path";
// import fs from "fs";

// const router = express.Router();

// // Ensure uploads folder exists
// const uploadDir = "./uploads";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Multer Storage Configuration
// const storage = multer.diskStorage({
//   destination: "./uploads/",
//   filename: (req, file, cb) => {
//     cb(null, `${req.params.id}_${Date.now()}${path.extname(file.originalname)}`);
//   },
// });
// const upload = multer({ storage });

// // ✅ Signup Route
// router.post("/signup", async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ success: false, message: "User already exists" });
//     }

//     const newUser = new User({
//       name,
//       email,
//       password,
//       profileImage: "",
//       preferences: {
//         dietaryRestrictions: [],
//         favoriteCuisines: [],
//         mealTypes: [],
//         notifications: true
//       },
//       savedRecipes: []
//     });

//     await newUser.save();

//     res.status(201).json({ success: true, message: "User created successfully" });
//   } catch (error) {
//     console.error("Signup error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // ✅ Get user by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ Update profile image
// router.put("/:id/upload", upload.single("profileImage"), async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     user.profileImage = `/uploads/${req.file.filename}`;
//     await user.save();

//     res.json({ message: "Profile image updated!", profileImage: user.profileImage });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;
