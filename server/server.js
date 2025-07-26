require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const path = require("path");

const app = express();

// ✅ MongoDB URI
const dbURL = process.env.MONGODB_URI || "mongodb+srv://Farmley_db:Farmley_9575@farmley.roovp.mongodb.net/?retryWrites=true&w=majority&appName=Farmley";

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://farmley-git-main-mohit-gamis-projects.vercel.app"
];

// ✅ CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin like mobile apps or curl
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
}));

// ✅ Set custom headers (important for preflight requests)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// ✅ Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Serve Static Files
app.use("/uploads", express.static("uploads"));

// ✅ MongoDB Connection
mongoose.set("strictQuery", false);
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Passport Config
app.use(passport.initialize());
require("./config/passport")(passport);

// ✅ Test Route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working ✅" });
});

// ✅ Import Routes
const userRoutes = require("./routes/api/user.js");
const productRoutes = require("./routes/api/Product.js");
const cartRoutes = require("./routes/api/cartRoutes.js");
const orderRoutes = require("./routes/api/Order.js");

// ✅ Register API Routes
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 [ERROR]:", err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
