const Quotes = require('../models/Quote');
const User = require('../models/User');
const router = require('express').Router();
const { isLoggedIn } = require('../middleware/authMiddleware');

// Get all quotes with search, filter, sort and pagination
router.get('/allquotes', async (req, res) => {
    try {
        const { search, category, sort, page = 1, limit = 10 } = req.query;
        let query = {};

        if (search) {
            // Regex for partial matches on both text and author
            const searchRegex = { $regex: search, $options: 'i' };
            query.$or = [
                { text: searchRegex },
                { author: searchRegex }
            ];
        }

        if (category && category !== 'All') {
            query.category = category;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const limitNum = parseInt(limit);

        let sortOption = { createdAt: -1 };
        if (sort === 'most-liked') {
            // Simple aggregation for most liked can be added if needed, 
            // for now, we maintain the default sort
        }

        const totalQuotes = await Quotes.countDocuments(query);
        const allQuotes = await Quotes.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum)
            .populate('owner', 'username');

        const sanitizedQuotes = allQuotes.map(q => {
            const quote = q.toObject();
            quote.likes = quote.likes || [];
            return quote;
        });

        res.status(200).json({
            quotes: sanitizedQuotes,
            pagination: {
                total: totalQuotes,
                page: parseInt(page),
                limit: limitNum,
                pages: Math.ceil(totalQuotes / limitNum)
            }
        });
    } catch (e) {
        console.error("GET /allquotes Error:", e);
        res.status(500).json({ msg: 'Something went wrong fetching quotes' });
    }
});

// Get unique categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Quotes.distinct('category');
        res.status(200).json(categories);
    } catch (e) {
        res.status(500).json({ msg: 'Error fetching categories' });
    }
});

// Add new quote (Protected)
router.post('/addquotes', isLoggedIn, async (req, res) => {
    try {
        const { text, author, category, tags } = req.body;
        const newQuote = await Quotes.create({
            text,
            author,
            category,
            tags,
            owner: req.user._id
        });
        res.status(201).json({ msg: "new quote created successfully", quote: newQuote });
    } catch (e) {
        res.status(400).json({ msg: 'Error creating quote' });
    }
});

// Get single quote
router.get('/quotes/:id', async (req, res) => {
    let { id } = req.params;
    try {
        const quote = await Quotes.findById(id).populate('owner', 'username');
        if (!quote) return res.status(404).json({ msg: 'Quote not found' });
        res.status(200).json(quote);
    } catch (e) {
        res.status(400).json({ msg: 'something went wrong' });
    }
});

// Update quote (Protected, Owner only)
router.patch('/quotes/:id', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const { text, author, category, tags } = req.body;

        let quote = await Quotes.findById(id);
        if (!quote) return res.status(404).json({ msg: 'Quote not found' });

        if (quote.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: "Not authorized to edit this quote" });
        }

        quote.text = text || quote.text;
        quote.author = author || quote.author;
        quote.category = category || quote.category;
        quote.tags = tags || quote.tags;

        await quote.save();
        console.log(`✅ Quote Updated: ${id}`);
        res.status(200).json({ msg: "Quote updated successfully", quote });
    } catch (e) {
        console.error("❌ PATCH /quotes/:id Error:", e);
        res.status(400).json({ msg: 'Error updating quote', error: e.message });
    }
});

// Delete quote (Protected, Owner only)
router.delete('/quotes/:id', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const quote = await Quotes.findById(id);

        if (!quote) return res.status(404).json({ msg: 'Quote not found' });

        if (quote.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: "Not authorized to delete this quote" });
        }

        await Quotes.findByIdAndDelete(id);
        res.status(200).json({ msg: "Quote deleted successfully" });
    } catch (e) {
        res.status(400).json({ msg: 'Error deleting quote' });
    }
});

const mongoose = require('mongoose');

// Like/Unlike quote (Protected)
router.post('/quotes/:id/like', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid Quote ID format" });
        }

        const quote = await Quotes.findById(id);
        if (!quote) return res.status(404).json({ msg: 'Quote not found' });

        const userId = req.user._id.toString();
        const index = quote.likes.findIndex(likeId => likeId && likeId.toString() === userId);

        if (index === -1) {
            quote.likes.push(new mongoose.Types.ObjectId(userId));
        } else {
            quote.likes.splice(index, 1);
        }

        await quote.save();
        res.status(200).json({ msg: "Success", likesCount: quote.likes.length });
    } catch (e) {
        console.error("LIKE ERROR:", e);
        res.status(400).json({ msg: 'Error liking quote', error: e.message });
    }
});

// In-memory cache for Quote of the Day
let qodCache = {
    quote: null,
    date: null
};

// Quote of the Day (Cached for 24 hours)
router.get('/quote-of-the-day', async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

        // Check if we have a valid cache for today
        if (qodCache.quote && qodCache.date === today) {
            return res.status(200).json(qodCache.quote);
        }

        const count = await Quotes.countDocuments();
        if (count === 0) return res.status(200).json(null);

        // Deterministic but date-based selection
        const seed = parseInt(today.replace(/-/g, ""));
        const index = seed % count;

        const quote = await Quotes.findOne().skip(index).populate('owner', 'username');

        // Update cache
        qodCache = {
            quote,
            date: today
        };

        res.status(200).json(quote);
    } catch (e) {
        console.error("QOD Error:", e);
        res.status(500).json({ msg: 'Error fetching quote of the day' });
    }
});

module.exports = router;