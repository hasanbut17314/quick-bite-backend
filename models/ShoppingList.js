import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  quantity: { type: String, trim: true },
});

const ShoppingListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipeId: {
    type: String,
  },
  comment: {
    type: String,
    trim: true,
  },
  ingredients: {
    type: [IngredientSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ShoppingList = mongoose.model("ShoppingList", ShoppingListSchema);

export default ShoppingList;
