import express from "express";
import Activity from "../models/Activity.js";
import SavedRecipe from "../models/SavedRecipe.js";   // example model
import Favorite from "../models/Favorite.js";         // example model
import auth from "../middleware/auth.js";
import isAdmins from "../middleware/adminAuth.js";
import mongoose from "mongoose";

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

// Admin route: Get all activities for a specific user by user ID
router.get("/user/:userId", isAdmins, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, startDate, endDate } = req.query;

    // Validate user ID
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID provided"
      });
    }

    // Build query
    const query = { userId };

    // Add date range filter if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get activities with pagination
    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email'); // Populate user details

    // Get total count for pagination
    const totalActivities = await Activity.countDocuments(query);

    // Get user stats
    const savedRecipeCount = await SavedRecipe.countDocuments({ userId });
    const favoriteCount = await Favorite.countDocuments({ userId });

    res.json({
      success: true,
      data: {
        activities,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalActivities / limit),
          totalActivities,
          hasNextPage: skip + activities.length < totalActivities,
          hasPrevPage: page > 1
        },
        userStats: {
          savedRecipes: savedRecipeCount,
          favorites: favoriteCount,
          totalActivities
        }
      }
    });
  } catch (err) {
    console.error('Error fetching user activities:', err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user activities"
    });
  }
});

export default router;
