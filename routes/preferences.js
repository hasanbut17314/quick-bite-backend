import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Update user preferences
// This endpoint allows updating user preferences like notifications, dark mode, dietary restrictions, etc.
router.put('/', auth, async (req, res) => {
  try {
    const { name, email, preferences } = req.body;

    const updateData = {};

    // Update name and email if provided
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    // If preferences provided, update only allowed fields
    if (preferences && typeof preferences === 'object') {
      const allowedFields = ['notifications', 'darkMode', 'dietaryRestrictions', 'favoriteCuisines', 'mealTypes'];
      for (const field of allowedFields) {
        if (field in preferences) {
          updateData[`preferences.${field}`] = preferences[field];
        }
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    );

    res.json({
      success: true,
      name: user.name,
      email: user.email,
      preferences: user.preferences,
    });
  } catch (err) {
    console.error('Error updating user settings:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;
