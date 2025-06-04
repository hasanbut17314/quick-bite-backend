import express from "express";
import Activity from "../models/Activity.js";
import SavedRecipe from "../models/SavedRecipe.js";   // example model
import Favorite from "../models/Favorite.js";         // example model
import auth from "../middleware/auth.js";

const router = express.Router();

// Create a new activity
router.post("/", auth, async (req, res) => {
  const { comment } = req.body;
  if (!comment?.trim()) {
    return res.status(400).json({ message: "Comment is required" });
  }
  try {
    const activity = new Activity({ userId: req.user._id, comment });
    await activity.save();
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ message: "Failed to create activity" });
  }
});

// Get all activities for user with today's filter and counts
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get start and end of today (local timezone)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Find activities created today for this user
    const activities = await Activity.find({
      userId,
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    }).sort({ createdAt: -1 });

    // Count saved recipes for user
    const savedRecipeCount = await SavedRecipe.countDocuments({ userId });

    // Count favorite items for user
    const favoriteCount = await Favorite.countDocuments({ userId });

    // Count of today's activities
    const todayActivitiesCount = activities.length;

    res.json({
      activities,
      counts: {
        savedRecipes: savedRecipeCount,
        favorites: favoriteCount,
        todayActivitiesCount,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch activities and counts" });
  }
});

export default router;
