import mongoose from "mongoose";

const SavedRecipeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  image: String,
  calories: Number,
  time: Number,
  link: String,
  createdAt: { type: Date, default: Date.now },
});

const SavedRecipe = mongoose.model("SavedRecipe", SavedRecipeSchema);

export default SavedRecipe;
