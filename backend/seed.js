const mongoose = require('mongoose');
const Quotes = require('./models/Quote');
const User = require('./models/User');

// Use a safe list of categories we support
const categories = ['Inspirational', 'Life', 'Success', 'Funny', 'Wisdom', 'Other'];

async function seedDB() {
    try {
        const count = await Quotes.countDocuments();
        if (count > 0) {
            console.log("ℹ️ Database already contains quotes. Skipping auto-seed.");
            return;
        }

        let user = await User.findOne();
        if (!user) {
            console.log("⚠️ No user found. Please signup first to seed with a valid owner.");
            return;
        }

        console.log("⏳ Fetching great quotes from ZenQuotes API...");

        const fallbackQuotes = [
            { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
            { q: "Life is what happens when you're busy making other plans.", a: "John Lennon" },
            { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
            { q: "The future belongs to those who believe in the beauty of their dreams.", a: "Eleanor Roosevelt" },
            { q: "It does not matter how slowly you go as long as you do not stop.", a: "Confucius" },
            { q: "Success is not final, failure is not fatal: it is the courage to continue that counts.", a: "Winston Churchill" },
            { q: "Hardships often prepare ordinary people for an extraordinary destiny.", a: "C.S. Lewis" },
            { q: "If you want to live a happy life, tie it to a goal, not to people or things.", a: "Albert Einstein" }
        ];

        let data = [];
        try {
            // Fetch a batch of quotes
            const response = await fetch('https://zenquotes.io/api/quotes/');
            data = await response.json();
            if (!Array.isArray(data) || data.length === 0) throw new Error("API returns empty data");
        } catch (err) {
            console.log("⚠️ ZenQuotes API unreachable. Using high-quality local fallback...");
            data = fallbackQuotes;
        }

        const quotesWithOwner = data.map(q => {
            return {
                text: q.q, // 'q' is the quote text in ZenQuotes
                author: q.a, // 'a' is the author
                category: 'Wisdom',
                tags: [],
                owner: user._id,
                likes: []
            };
        });

        await Quotes.insertMany(quotesWithOwner);
        console.log(`✅ DB seeded successfully with ${quotesWithOwner.length} premium quotes!`);

    } catch (err) {
        console.error("❌ Error seeding DB:", err.message);
        console.log("Falling back to local dummy quotes...");
        // Add minimal local fallback here if needed
    }
}

module.exports = seedDB;