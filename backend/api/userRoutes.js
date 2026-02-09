const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// Rate limiting for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: { msg: "Too many attempts, please try again after 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
});

// Signup
router.post('/signup', authLimiter, async (req, res) => {
    try {
        const { username, name, email, password } = req.body;

        // Basic validation
        if (!username || !name || !email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ msg: "Username or Email already taken" });
        }

        const user = await User.create({ username, name, email, password });
        console.log("User created:", user._id);

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing from environment variables");
        }

        const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
        console.log("Token generated");

        res.status(201).json({
            msg: "User registered successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error("SIGNUP ERROR DETAILS:", {
            name: err.name,
            message: err.message,
            stack: err.stack
        });
        res.status(500).json({ msg: "Internal Server Error", error: err.message });
    }
});

// Login
router.post('/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Please provide email and password" });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            msg: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({ msg: "Internal Server Error", error: err.message });
    }
});

const { isLoggedIn } = require('../middleware/authMiddleware');

const mongoose = require('mongoose');

// Toggle Favorite
router.post('/quotes/:id/favorite', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Favorite Toggle - ID:", id, "User:", req.user._id);

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid Quote ID format" });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            console.log("Favorite Toggle - User not found");
            return res.status(404).json({ msg: "User not found" });
        }

        // Robust comparison using toString()
        const index = user.favorites.findIndex(favId => favId && favId.toString() === id);

        if (index === -1) {
            user.favorites.push(new mongoose.Types.ObjectId(id));
        } else {
            user.favorites.splice(index, 1);
        }

        await user.save();
        res.status(200).json({ msg: "Favorites updated", favorites: user.favorites });
    } catch (err) {
        console.error("❌ FAVORITE TOGGLE ERROR DETAILS:", err);
        res.status(400).json({ msg: "Error updating favorites", error: err.message });
    }
});

// Get User Profile Summary
router.get('/profile', isLoggedIn, async (req, res) => {
    try {
        const Quotes = require('../models/Quote');
        const userQuotes = await Quotes.find({ owner: req.user._id });
        const user = await User.findById(req.user._id);

        // Calculate total likes received
        const totalLikes = userQuotes.reduce((acc, q) => acc + (q.likes ? q.likes.length : 0), 0);

        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                totalQuotes: userQuotes.length,
                totalLikes,
                totalFavorites: user.favorites.length
            }
        });
    } catch (err) {
        console.error("GET /profile Error:", err);
        res.status(500).json({ msg: "Error fetching profile" });
    }
});

// Get User Favorites (Protected)
router.get('/users/favorites', isLoggedIn, async (req, res) => {
    try {
        const Quotes = require('../models/Quote');
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const limitNum = parseInt(limit);

        const user = await User.findById(req.user._id).select('favorites');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const total = user.favorites.length;

        const favorites = await Quotes.find({ _id: { $in: user.favorites } })
            .populate('owner', 'username name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        res.status(200).json({
            quotes: favorites,
            pagination: {
                total,
                page: parseInt(page),
                limit: limitNum,
                pages: Math.ceil(total / limitNum)
            }
        });
    } catch (err) {
        console.error("GET /users/favorites Error:", err);
        res.status(500).json({ msg: 'Error fetching favorite quotes' });
    }
});

// Get User Liked Quotes (Protected)
router.get('/users/liked', isLoggedIn, async (req, res) => {
    try {
        const Quotes = require('../models/Quote');
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const limitNum = parseInt(limit);

        const total = await Quotes.countDocuments({ likes: req.user._id });
        const likedQuotes = await Quotes.find({ likes: req.user._id })
            .populate('owner', 'username name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        res.status(200).json({
            quotes: likedQuotes,
            pagination: {
                total,
                page: parseInt(page),
                limit: limitNum,
                pages: Math.ceil(total / limitNum)
            }
        });
    } catch (err) {
        console.error("GET /users/liked Error:", err);
        res.status(500).json({ msg: 'Error fetching liked quotes' });
    }
});

module.exports = router;
