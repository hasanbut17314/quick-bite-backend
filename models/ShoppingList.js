import mongoose from "mongoose";

const ShoppingListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assuming you have a User model
    required: true,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ShoppingList = mongoose.model("ShoppingList", ShoppingListSchema);

export default ShoppingList;
