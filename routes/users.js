import express from "express";
import User from "../models/User.js";
import SavedRecipe from "../models/SavedRecipe.js";
import Activity from "../models/Activity.js";
import isAdmins from "../middleware/adminAuth.js";

const router = express.Router();

// Admin-only: Create User
router.post("/", isAdmins, async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "Name, email, and password are required" });

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Failed to create user" });
  }
});

// Admin-only: Get All Regular Users with Pagination
router.get("/", isAdmins, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const filter = { role: "user" }; // ⬅️ Only users, exclude admins
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Admin-only: Update User
router.put("/:id", isAdmins, async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing && existing._id.toString() !== req.params.id) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
});

// Admin-only: Delete User
router.delete("/:id", isAdmins, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// Admin-only: Overview Stats
router.get("/overview", isAdmins, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" }); // ⬅️ Only count regular users
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const savedRecipesToday = await SavedRecipe.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const activitiesToday = await Activity.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    res.json({
      totalUsers,
      savedRecipesToday,
      activitiesToday,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch overview data" });
  }
});

// Admin-only: Paginated User Activities
router.get("/activities", isAdmins, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const total = await Activity.countDocuments();

    const activities = await Activity.find()
      .populate("userId", "name") // <--- Populate user name via `userId`
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      activities,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching activities:", err);
    res.status(500).json({ message: "Failed to fetch activities" });
  }
});



// Admin-only: Weekly Chart Data (Users + Saved Recipes)
router.get("/charts/weekly", isAdmins, async (req, res) => {
  try {
    const today = new Date();
    const dates = [];
    const labels = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const label = date.toISOString().split("T")[0]; // e.g., '2025-06-18'
      labels.push(label);

      dates.push({ start: date, end: nextDate, label });
    }

    const savedRecipes = await Promise.all(
      dates.map(async ({ start, end, label }) => ({
        date: label,
        count: await SavedRecipe.countDocuments({ createdAt: { $gte: start, $lt: end } }),
      }))
    );

    const users = await Promise.all(
      dates.map(async ({ start, end, label }) => ({
        date: label,
        count: await User.countDocuments({
          role: "user",
          createdAt: { $gte: start, $lt: end },
        }),
      }))
    );

    res.json({
      labels,
      savedRecipes,
      users,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch weekly chart data" });
  }
});


export default router;
