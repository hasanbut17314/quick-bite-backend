import express from "express";
import ShoppingList from "../models/ShoppingList.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create a new shopping list item
router.post("/", auth, async (req, res) => {
  const { recipeId, comment, ingredients } = req.body;

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ message: "Ingredients are required." });
  }

  try {
    const item = new ShoppingList({
      userId: req.user._id,
      recipeId,
      comment,
      ingredients,
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to create shopping list item." });
  }
});

// Get all shopping list items for the user
router.get("/", auth, async (req, res) => {
  try {
    const items = await ShoppingList.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch shopping list items." });
  }
});

// Update shopping list item
router.put("/:id", auth, async (req, res) => {
  const { recipeId, comment, ingredients } = req.body;

  try {
    const item = await ShoppingList.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { recipeId, comment, ingredients },
      { new: true }
    );

    if (!item) return res.status(404).json({ message: "Item not found." });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to update shopping list item." });
  }
});

// Delete shopping list item
router.delete("/", auth, async (req, res) => {
  const { recipeId } = req.body;  // Get recipeId (URL) from request body

  if (!recipeId) {
    return res.status(400).json({ message: "recipeId is required to delete an item." });
  }

  try {
    const item = await ShoppingList.findOneAndDelete({
      recipeId: recipeId,
      userId: req.user._id,
    });

    // If not found, still return success (no error)
    res.json({ message: "Item deleted successfully." });
  } catch (err) {
    console.error("Failed to delete shopping list item:", err);
    res.status(500).json({ message: "Failed to delete shopping list item." });
  }
});


// Delete shopping list item by ID
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;  // get id from URL

  try {
    const item = await ShoppingList.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!item) return res.status(404).json({ message: "Item not found." });

    res.json({ message: "Item deleted successfully." });
  } catch (err) {
    console.error("Failed to delete shopping list item:", err);
    res.status(500).json({ message: "Failed to delete shopping list item." });
  }
});


export default router;
