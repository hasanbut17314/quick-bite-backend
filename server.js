// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import mongoose from "mongoose";
// import nodemailer from "nodemailer";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import Contact from "./models/Contact.js";
// import User from "./models/User.js";
// import userRoutes from "./routes/userRoutes.js";
// import authRoutes from './routes/authRoutes.js';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors({
//   origin: 'http://localhost:3000',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.use(express.json());
// // Routes
// app.use('/api/auth', authRoutes);

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverSelectionTimeoutMS: 5000,
//   })
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));
 
// // User Routes
// app.use("/api/users", userRoutes);

// // Recipe Model 
// const RecipeSchema = new mongoose.Schema({
//   title: String,
//   ingredients: [String],
//   directions: [String],
//   link: String,
//   source: String,
//   NER: [String]
// }, { collection: 'RecipeNLGDataBase' }); 

// const Recipe = mongoose.model('Recipe', RecipeSchema);

// // // Enhanced CORS configuration
// // app.use(cors({
// //   origin: 'http://localhost:3000',
// //   methods: ['GET', 'POST'],
// //   allowedHeaders: ['Content-Type']
// // }));

// // Single, improved recipe search endpoint
// app.get('/api/recipes', async (req, res) => {
//   try {
//     const { ingredients } = req.query;
    
//     if (!ingredients) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Please provide ingredients to search' 
//       });
//     }

//     const ingredientList = ingredients.split(',').map(i => i.trim().toLowerCase());
    
//     const searchQueries = ingredientList.map(ingredient => ({
//       ingredients: { $regex: new RegExp(ingredient, 'i') }
//     }));

//     const recipes = await Recipe.find({ $or: searchQueries }).limit(20);
    
//     if (recipes.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No recipes found with these ingredients'
//       });
//     }

//     res.json({
//       success: true,
//       recipes,
//       count: recipes.length
//     });
    
//   } catch (error) {
//     console.error('Recipe search error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error during recipe search',
//       error: error.message 
//     });
//   }
// });
// // Nodemailer Configuration
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Contact Form Route
// app.post("/contact", async (req, res) => {
//   const { name, email, message } = req.body;

//   if (!name || !email || !message) {
//     return res.status(400).json({ success: false, message: "All fields are required" });
//   }

//   try {
//     const newContact = new Contact({ name, email, message });
//     await newContact.save();

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: "your-email@gmail.com",
//       subject: `New Contact Form Submission from ${name}`,
//       text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ success: true, message: "Message sent and stored successfully!" });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ success: false, message: "Server error. Please try again later." });
//   }
// });

// // Signup Endpoint
// app.post("/signup", async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ success: false, message: "Email already exists." });

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     user = new User({ name, email, password: hashedPassword });
//     await user.save();

//     res.json({ success: true, message: "User registered successfully!" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error. Please try again." });
//   }
// });

// // Login Endpoint
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ success: false, message: "User not found." });

//     const isValid = await bcrypt.compare(password, user.password);
//     if (!isValid) return res.status(400).json({ success: false, message: "Invalid password." });

//     const token = jwt.sign(
//       { userId: user._id, name: user.name, email: user.email },
//       process.env.JWT_SECRET || "secret_key",
//       { expiresIn: "1h" }
//     );

//     res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email } });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Something went wrong." });
//   }
// });

// // Default Route
// app.get("/", (req, res) => {
//   res.send("🚀 Server is running...");
// });

// // Start Server
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// 
//New
// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import mongoose from "mongoose";
// import userRoutes from "./routes/userRoutes.js";
// import authRoutes from './routes/authRoutes.js';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors({
//   origin: 'http://localhost:3000',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverSelectionTimeoutMS: 5000,
//   })
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use("/api/users", userRoutes);

// // Recipe Model and Routes (keep your existing implementation)

// // Default Route
// app.get("/", (req, res) => {
//   res.send("🚀 Server is running...");
// });

// // Error Handling Middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ success: false, message: 'Internal Server Error' });
// });

// // Start Server
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//latest
// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import mongoose from "mongoose";
// import userRoutes from "./routes/userRoutes.js";
// import authRoutes from './routes/authRoutes.js';
// import dashboardRoute from "./routes/dashboard";

// const dashboardRoute = require("./routes/dashboard.js");
// app.use("/api/dashboard", dashboardRoute);



// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors({
//   origin: 'http://localhost:3000',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverSelectionTimeoutMS: 5000,
//   })
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// // Routes
// app.use('/api/auth', authRoutes);     // for signup/login
// app.use("/api/users", userRoutes);    // for user/profile dashboard logic

// // Default Route
// app.get("/", (req, res) => {
//   res.send("🚀 Server is running...");
// });

// // Error Handling Middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ success: false, message: 'Internal Server Error' });
// });


// // Start Server
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from './routes/authRoutes.js';
import dashboardRoute from "./routes/dashboard.js";
import shoppingListRoutes from "./routes/ShoppingList.js"; // Assuming you have a listRoutes.js file 
import favoriteRoutes from "./routes/favorite.js";
import savedRecipeRoutes from "./routes/savedRecipe.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoute);// <--- use dashboardRoute here
app.use("/api/list", shoppingListRoutes); // <--- use shoppingListRoutes here
app.use("/api/favorites", favoriteRoutes);
app.use("/api/savedrecipes", savedRecipeRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
