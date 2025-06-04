import express from "express";
import SavedRecipe from "../models/SavedRecipe.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create saved recipe
router.post("/", auth, async (req, res) => {
  const { title, image, calories, time, link } = req.body;
  if (!title || !link) {
    return res.status(400).json({ message: "Title and recipeId required" });
  }
  try {
    const savedRecipe = new SavedRecipe({ userId: req.user._id, title, image, calories, time, link });
    await savedRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (err) {
    res.status(500).json({ message: "Failed to save recipe" });
  }
});

// Get all saved recipes for user
router.get("/", auth, async (req, res) => {
  try {
    const savedRecipes = await SavedRecipe.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(savedRecipes);
  } catch (err) {
    res.status(500).json({ message: "Failed to get saved recipes" });
  }
});

// Delete saved recipe by ID
router.delete("/", auth, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: "URL is required" });

    const savedRecipe = await SavedRecipe.findOneAndDelete({
      link: url,
      userId: req.user._id,
    });

    if (!savedRecipe) return res.status(404).json({ message: "Saved recipe not found" });

    res.json({ message: "Saved recipe deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete saved recipe" });
  }
});


export default router;
