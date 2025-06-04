import express from "express";
import ShoppingList from "../models/ShoppingList.js";
import auth  from "../middleware/auth.js";

const router = express.Router();

// Create a new shopping item
router.post("/", auth, async (req, res) => {
  const { comment } = req.body;
  if (!comment?.trim()) return res.status(400).json({ message: "Comment is required." });

  try {
    const item = new ShoppingList({ userId: req.user._id, comment }); // 🔁 Fix here
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to create item." });
  }
});

// Get all items for user
router.get("/", auth, async (req, res) => {
  try {
    const items = await ShoppingList.find({ userId: req.user._id }).sort({ createdAt: -1 }); // 🔁 Fix here
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch items." });
  }
});

// Update item comment
router.put("/:id", auth, async (req, res) => {
  const { comment } = req.body;
  if (!comment?.trim()) return res.status(400).json({ message: "Comment is required." });

  try {
    const item = await ShoppingList.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id }, // 🔁 Fix here
      { comment },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Item not found." });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to update item." });
  }
});

// Delete item
router.delete("/:id", auth, async (req, res) => {
  try {
    const item = await ShoppingList.findOneAndDelete({ _id: req.params.id, userId: req.user._id }); // 🔁 Fix here
    if (!item) return res.status(404).json({ message: "Item not found." });
    res.json({ message: "Item deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete item." });
  }
});

export default router;
