import express from "express";
import Favorite from "../models/Favorite.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create a favorite
router.post("/", auth, async (req, res) => {
  const { title, image, calories, time, link } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Title and recipeId required" });
  }
  try {
    const favorite = new Favorite({ userId: req.user._id, title, image, calories, time, link });
    await favorite.save();
    res.status(201).json(favorite);
  } catch (err) {
    res.status(500).json({ message: "Failed to add favorite" });
  }
});

// Get all favorites for user
router.get("/", auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: "Failed to get favorites" });
  }
});

// Delete favorite by ID
router.delete("/", auth, async (req, res) => {
  try {
    const { url } = req.body;  // get url from request body
    if (!url) return res.status(400).json({ message: "URL is required" });

    const favorite = await Favorite.findOneAndDelete({ link: url, userId: req.user._id });
    if (!favorite) return res.status(404).json({ message: "Favorite not found" });

    res.json({ message: "Favorite deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete favorite" });
  }
});


export default router;
