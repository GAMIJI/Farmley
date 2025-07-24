require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const path = require("path");

// Import Routes
const userRoutes = require("./routes/api/user.js");
const productRoutes = require("./routes/api/Product.js");
const cartRoutes = require("./routes/api/cartRoutes.js") 
const Order = require("./routes/api/Order.js") 
const app = express();
const host = '192.168.29.119'; // Your machine's local IP

// ✅ Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [
  "http://localhost:5000",
  "http://192.168.29.119:5000"
];

app.use(cors({
  origin: allowedOrigins,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true
}));

// ✅ Serve Static Files (Profile Images, etc.)
app.use("/uploads", express.static("uploads"));

// ✅ MongoDB Connection
const dbURL = process.env.MONGODB_URI || "mongodb+srv://Farmley_db:Farmley_9575@farmley.roovp.mongodb.net/?retryWrites=true&w=majority&appName=Farmley";

mongoose.set("strictQuery", false); // Prevent deprecation warning
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Passport Middleware & Config
app.use(passport.initialize());
require("./config/passport")(passport);

// ✅ API Routes
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart",cartRoutes)
app.use("/api/order",Order)

// ✅ Serve Frontend in Production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("🔥 [ERROR]:", err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// ✅ Start Server
const port =  5001;
app.listen(port,() => console.log(`🚀 Server running on port ${port}`));
