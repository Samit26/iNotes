// Import required modules
const express = require("express");
const router = express.Router();
const User = require("../models/Users.js");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser.js");

// Secret for JWT
const secret = "Idontknowwhatimdoing";

// Define a POST route for user signup
router.post(
  "/api/auth/signup",
  [
    // Validate the request body
    body("name").isLength({ min: 3 }), // Name should be at least 3 characters long
    body("email").isEmail(), // Email should be a valid email
    body("password").isLength({ min: 5 }), // Password should be at least 5 characters long
  ],
  async (req, res) => {
    // Check the validation result
    const errors = validationResult(req);
    // If there are validation errors, send a 400 status code and the errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Generate a salt for password hashing
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const pass = await bcrypt.hash(req.body.password, salt);
    // Create a new user with the hashed password
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: pass,
    });

    try {
      // Save the user to the database
      await user.save();
      // Create a JWT for the user
      const payload = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(payload, secret, { expiresIn: '7d' });
      // Send the JWT in the response
      res.json({ authtoken });
    } catch (error) {
      // If there's an error, send a 500 status code and the error message
      res.status(500).send("Error: " + error);
    }
  }
);

// Define a POST route for user login
router.post("/api/auth/login", [body("email").isEmail()], async (req, res) => {
  try {
    // Validate the request body
    const errors = validationResult(req);
    // If there are validation errors, send a 400 status code and the errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure email and password from the request body
    const { email, password } = req.body;
    // Try to find a user with the provided email
    const user = await User.findOne({ email });
    // If no user is found, send a 400 status code and an error message
    if (!user) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }
    // Compare the provided password with the user's password
    const passMatch = await bcrypt.compare(password, user.password);
    // If the passwords don't match, send a 400 status code and an error message
    if (!passMatch) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    // Create a JWT for the user
    const payload = {
      user: {
        id: user.id,
      },
    };
    const authtoken = jwt.sign(payload, secret, { expiresIn: '7d' });
    // Send the JWT in the response
    res.json({ authtoken });
  } catch (error) {
    // If there's an error, send a 500 status code and the error message
    res.status(500).send("Error: " + error);
  }
});

// Define a POST route to get the user
router.post("/api/auth/getuser",fetchuser ,async (req, res) => {
  try {
    // Fetch the user from the database
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    // Send the user in the response
    res.send(user);
  } catch (error) {
    // If there's an error, send a 500 status code and the error message
    res.status(500).send("Error: " + error);
  }
});
// Export the router
module.exports = router