import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Save a recipe
router.post('/save', auth, async (req, res) => {
  try {
    const { recipe } = req.body;

    if (!recipe || !recipe.uri) {
      return res.status(400).json({ error: 'Invalid recipe data' });
    }

    const user = await User.findById(req.user._id);

    const alreadySaved = user.savedRecipes.some(r => r.uri === recipe.uri);
    if (alreadySaved) {
      return res.status(400).json({ error: 'Recipe already saved' });
    }

    user.savedRecipes.push({
      uri: recipe.uri,
      label: recipe.label,
      image: recipe.image,
      source: recipe.source,
      url: recipe.url,
      dietLabels: recipe.dietLabels || [],
      healthLabels: recipe.healthLabels || [],
      ingredients: recipe.ingredientLines || [],
      calories: recipe.calories,
      totalTime: recipe.totalTime
    });

    await user.save();
    res.json(user.savedRecipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove a saved recipe
router.delete('/remove/:uri', auth, async (req, res) => {
  try {
    const { uri } = req.params;
    const user = await User.findById(req.user._id);

    user.savedRecipes = user.savedRecipes.filter(recipe => recipe.uri !== uri);
    await user.save();

    res.json(user.savedRecipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all saved recipes
router.get('/saved', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('savedRecipes');
    res.json(user.savedRecipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user preferences
// This endpoint allows updating user preferences like notifications, dark mode, dietary restrictions, etc.
router.put('/preferences', auth, async (req, res) => {
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
      name: user.name,
      email: user.email,
      preferences: user.preferences,
    });
  } catch (err) {
    console.error('Error updating user settings:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



// Get user by ID (for dashboard)
router.get('/:id', auth, async (req, res) => {
  try {
    if (req.user._id !== req.params.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
