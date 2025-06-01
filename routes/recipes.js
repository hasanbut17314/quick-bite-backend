const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Save a recipe
router.post('/save', auth, async (req, res) => {
  try {
    const { recipe } = req.body;
    
    if (!recipe || !recipe.uri) {
      return res.status(400).json({ error: 'Invalid recipe data' });
    }

    const user = await User.findById(req.user._id);
    
    // Check if recipe is already saved
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
router.put('/preferences', auth, async (req, res) => {
  try {
    const { preferences } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { preferences } },
      { new: true }
    );
    res.json(user.preferences);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;