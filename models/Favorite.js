import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  image: String,
  calories: Number,
  time: Number,
  recipeId: { type: String, required: true },
  link: String,
  createdAt: { type: Date, default: Date.now },
});

const Favorite = mongoose.model("Favorite", FavoriteSchema);

export default Favorite;
