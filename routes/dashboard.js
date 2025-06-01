// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");

// // router.get("/:userId", async (req, res) => {
// //   console.log("User ID requested:", req.params.userId); // Add this
// //   try {
// //     const user = await User.findById(req.params.userId).select("-password").populate("favorites");
// //     if (!user) return res.status(404).json({ message: "User not found" });

// //     res.json(user);
// //   } catch (err) {
// //     console.error("Dashboard error:", err); // Add this
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });
// const auth = require("../middleware/auth");

// router.get("/", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id)
//       .select("-password")
//       .populate("favorites");

//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.json(user);
//   } catch (err) {
//     console.error("Dashboard error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });


// module.exports = router;

import express from "express";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    console.log("req.user:", req.user); // Log the user
    res.status(200).json(req.user);
  } catch (err) {
    console.error("Error in /dashboard route:", err.message); // Log error
    res.status(500).json({ message: "Server error loading dashboard" });
  }
});

export default router;

