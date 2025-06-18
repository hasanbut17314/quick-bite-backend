import express from "express";
import ShoppingList from "../models/ShoppingList.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";
import { sendShoppingReminderEmail } from "../utils/emailService.js";

const router = express.Router();

// Create a new shopping list item
router.post("/", auth, async (req, res) => {
  let { recipeId, comment, ingredients, status, shoppingDate } = req.body;

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ message: "Ingredients are required." });
  }

  const defaultDate = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours from now

  try {
    // If shoppingDate provided, add 5 hours to it
    if (shoppingDate) {
      const date = new Date(shoppingDate);
      date.setHours(date.getHours() + 5);
      shoppingDate = date;
    } else {
      shoppingDate = defaultDate;
    }

    const item = new ShoppingList({
      userId: req.user._id,
      recipeId,
      comment,
      ingredients,
      status: status || "pending",
      shoppingDate,
    });

    await item.save();

    // Clone and adjust the response shoppingDate (+5h again for frontend display)
    const responseItem = item.toObject();
    if (responseItem.shoppingDate) {
      const adjustedDate = new Date(responseItem.shoppingDate);
      adjustedDate.setHours(adjustedDate.getHours() + 5);
      responseItem.shoppingDate = adjustedDate;
    }

    res.status(201).json(responseItem);
  } catch (err) {
    res.status(500).json({ message: "Failed to create shopping list item." });
  }
});

// Get all shopping list items for the authenticated user

router.get("/", auth, async (req, res) => {
  try {
    const items = await ShoppingList.find({ userId: req.user._id }).sort({ createdAt: -1 });

    // Add 5 hours to each shoppingDate before sending
    const adjustedItems = items.map(item => {
      const adjustedItem = item.toObject();
      if (adjustedItem.shoppingDate) {
        const date = new Date(adjustedItem.shoppingDate);
        date.setHours(date.getHours() + 5);
        adjustedItem.shoppingDate = date;
      }
      return adjustedItem;
    });

    res.json(adjustedItems);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch shopping list items." });
  }
});


/// Update shopping list item
router.put("/:id", auth, async (req, res) => {
  let { recipeId, comment, ingredients, status, shoppingDate } = req.body;

  try {
    // Add 5 hours before saving (as per your existing logic)
    if (shoppingDate) {
      const date = new Date(shoppingDate);
      date.setHours(date.getHours() + 5);
      shoppingDate = date;
    }

    const item = await ShoppingList.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        recipeId,
        comment,
        ingredients,
        status,
        shoppingDate,
      },
      { new: true }
    );

    if (!item) return res.status(404).json({ message: "Item not found." });

    // Clone and add 5 hours again for the response
    const responseItem = item.toObject();
    if (responseItem.shoppingDate) {
      const adjustedDate = new Date(responseItem.shoppingDate);
      adjustedDate.setHours(adjustedDate.getHours() + 5);
      responseItem.shoppingDate = adjustedDate;
    }

    res.json(responseItem);
  } catch (err) {
    res.status(500).json({ message: "Failed to update shopping list item." });
  }
});



// Delete shopping list item by recipeId
router.delete("/", auth, async (req, res) => {
  const { recipeId } = req.body;

  if (!recipeId) {
    return res.status(400).json({ message: "recipeId is required to delete an item." });
  }

  try {
    await ShoppingList.findOneAndDelete({
      recipeId,
      userId: req.user._id,
    });

    res.json({ message: "Item deleted successfully." });
  } catch (err) {
    console.error("Failed to delete shopping list item:", err);
    res.status(500).json({ message: "Failed to delete shopping list item." });
  }
});

// Delete shopping list item by ID
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;

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

// ... your imports and routes above ...

// ---- AUTO REMINDER FUNCTION ----
const CHECK_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
const TEN_MINUTES_MS = 10 * 60 * 1000;

const sendShoppingReminders = async () => {
  try {
    const now = new Date();
    const upperBound = new Date(now.getTime() + TEN_MINUTES_MS);

    const items = await ShoppingList.find({
      shoppingDate: { $gte: now, $lte: upperBound },
      status: "pending"
    });

    if (items.length === 0) {
      return;
    }

    for (const item of items) {
      try {
        const user = await User.findById(item.userId);
        if (!user || !user.email) {
          console.warn(`❌ User or email not found for userId: ${item.userId}`);
          continue;
        }

        // Send email using comment and shoppingDate
        const emailResult = await sendShoppingReminderEmail(
          user.email,
          item.comment,
          item.shoppingDate
        );


        // Mark item as sent
        await ShoppingList.updateOne(
          { _id: item._id },
          { status: "reminderSent" }
        );
      } catch (err) {
        console.error(`❌ Failed to send reminder for item ${item._id}:`, err);
      }
    }
  } catch (err) {
    console.error("❌ Error in shopping reminder job:", err);
  }
};

// Run every 5 minutes
setInterval(sendShoppingReminders, CHECK_INTERVAL_MS);
sendShoppingReminders(); // Initial run


export default router;


