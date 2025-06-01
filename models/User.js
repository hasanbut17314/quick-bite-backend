// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const UserSchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     required: true 
//   },
//   email: { 
//     type: String, 
//     required: true, 
//     unique: true 
//   },
//   password: { 
//     type: String, 
//     required: true 
//   },
//   profileImage: { 
//     type: String, 
//     default: "/uploads/default.png" 
//   },
//   savedItems: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Item" // Change this to whatever model your saved items reference
//   }],
//   favorites: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Favorite" // Change this to whatever model your favorites reference
//   }],
//   activityCount: {
//     type: Number,
//     default: 0
//   },
//   recentActivity: [{
//     action: String,
//     date: {
//       type: Date,
//       default: Date.now
//     }
//   }],
//   preferences: {
//     notifications: {
//       type: Boolean,
//       default: true
//     },
//     darkMode: {
//       type: Boolean,
//       default: false
//     }
//   }
// }, { timestamps: true });

// // Hash password before saving
// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Method to compare passwords
// UserSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const User = mongoose.model("User", UserSchema);
// export default User;
//New
// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true }
// });

// module.exports = mongoose.model("User", userSchema);

//Latest
// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   savedRecipes: [
//     {
//       uri: String,
//       label: String,
//       image: String,
//       source: String,
//       url: String,
//       dietLabels: [String],
//       healthLabels: [String],
//       ingredients: [String],
//       calories: Number,
//       totalTime: Number
//     }
//   ],
//   preferences: Object
// });

// const User = mongoose.model('User', userSchema);
// export default User;

// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   image: { type: String, default: "" },
//   preferences: {
//     diet: { type: String, default: "" },
//     intolerances: [String],
//     cuisine: [String],
//   },
//   savedRecipes: [
//     {
//       title: String,
//       image: String,
//       calories: Number,
//       ingredients: [String],
//       source: String,
//       time: Number,
//     },
//   ],
//   favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
//   stats: {
//     searches: { type: Number, default: 0 },
//     lastLogin: { type: Date, default: Date.now },
//   },
// });

// module.exports = mongoose.model("User", userSchema);
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  image: String,
  preferences: {
    diet: String,
    intolerances: [String],
    cuisine: [String],
  },
  stats: {
    searches: { type: Number, default: 0 },
    lastLogin: Date,
  },
  savedRecipes: [
    {
      title: String,
      image: String,
      calories: Number,
      time: Number,
      recipeId: String,
    }
  ]
});

const User = mongoose.model("User", userSchema);

export default User;
