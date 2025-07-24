const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const keys = require("../../config/keys");
const authenticate = require("../../middleware/authenticate");

// Load input validation
const validateSignUpInput = require("../../validation/Signup");
const validateLoginInput = require("../../validation/Login");

// Load User model
const User = require("../../models/UserSchema");

// Setup multer for profile image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Only .jpeg, .jpg, and .png formats are allowed!"));
    }
  },
});

// @route GET api/user/fetch
// router.get("/fetch", (req, res) => {
//   res.send("Hello, world!");
// });

// @route POST api/user/signup
// routes/api/user.js
// @route POST api/user/signup
router.post("/signup", async (req, res) => {
  const { errors, isValid } = validateSignUpInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { name, email, mobile, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ email: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      // ⛔️ Don't set profileImage: null
      // ✅ Frontend will handle default profile image
    });

    await newUser.save();
    return res.status(201).json({ success: true, message: "User created" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Server error occurred" });
  }
});



// @route POST api/user/login
router.post("/login", async (req, res) => {
  // console.log("🔹 [LOGIN] Route hit!");

  // Validate input
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  try {
    // console.log(`🔍 [LOGIN] Searching for user with email: ${email}`);

    // Find user by email
    const user = await User.findOne({ email });
    // console.log(user);
        
    if (!user) {
      return res.status(404).json({ email: "Email not found" });
    }

    // console.log(`✅ [LOGIN] User found: ${user.name}`);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ password: "Password incorrect" });
    }

    // console.log("✅ [LOGIN] Password matched! Generating JWT...");

    // Create JWT Payload
    const payload = { id: user.id};

    // Sign token
    jwt.sign(payload, keys.secretOrKey, { expiresIn: "1y" }, (err, token) => {
      if (err) {
        return res.status(500).json({ error: "Token generation failed" });
      }
      res.json({ success: true, token: "Bearer " + token, user  });
    });
  } catch (error) {
    console.error("❌ [LOGIN ERROR]:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// @route GET api/user/profile
// @route PUT api/user/profile/update
// @desc Update profile image, name, and mobile (user must be authenticated)
router.put("/profile/update", authenticate, upload.single("profileImage"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, mobile, address } = req.body;

    // ✅ Update name and mobile if provided
    if (name) user.name = name;
    if (mobile) user.mobile = mobile;
    if(address) user.address = address

    // ✅ Update profile image if file is uploaded
    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile updated",
      user: {
        name: user.name,
        email:user.email,
        address:user.address,
        mobile: user.mobile,
        profileImage: user.profileImage
      }
    });
  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
