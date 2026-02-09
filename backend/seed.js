const mongoose = require('mongoose');
const Quotes = require('./models/Quote');
const User = require('./models/User');

// Use a safe list of categories we support
const categories = ['Inspirational', 'Life', 'Success', 'Funny', 'Wisdom', 'Other'];

// Map Quotable API tags to our categories
function mapTagToCategory(tags) {
    if (!tags || tags.length === 0) return 'Wisdom';

    const tagLower = tags[0].toLowerCase();
    if (tagLower.includes('inspirational') || tagLower.includes('motivational')) return 'Inspirational';
    if (tagLower.includes('life') || tagLower.includes('living')) return 'Life';
    if (tagLower.includes('success') || tagLower.includes('achievement')) return 'Success';
    if (tagLower.includes('humor') || tagLower.includes('funny')) return 'Funny';
    if (tagLower.includes('wisdom') || tagLower.includes('philosophy')) return 'Wisdom';
    return 'Other';
}

async function seedDB() {
    try {
        const count = await Quotes.countDocuments();
        if (count > 0) {
            console.log("ℹ️  Database already contains quotes. Skipping auto-seed.");
            return;
        }

        let user = await User.findOne();
        if (!user) {
            console.log("⚠️  No user found. Please signup first to seed with a valid owner.");
            return;
        }

        console.log("⏳ Fetching high-quality quotes from Quotable API...");

        const fallbackQuotes = [
            { content: "The only way to do great work is to love what you do.", author: "Steve Jobs", tags: ['inspirational'] },
            { content: "Life is what happens when you're busy making other plans.", author: "John Lennon", tags: ['life'] },
            { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", tags: ['inspirational'] },
            { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", tags: ['inspirational'] },
            { content: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", tags: ['wisdom'] },
            { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", tags: ['success'] },
            { content: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis", tags: ['inspirational'] },
            { content: "If you want to live a happy life, tie it to a goal, not to people or things.", author: "Albert Einstein", tags: ['life'] }
        ];

        let data = [];
        try {
            // Fetch a batch of quotes from Quotable API
            // Using /quotes endpoint with limit parameter for multiple quotes
            const response = await fetch('https://api.quotable.io/quotes?limit=50');
            const result = await response.json();

            if (!result.results || !Array.isArray(result.results) || result.results.length === 0) {
                throw new Error("API returned empty data");
            }

            data = result.results;
            console.log(`✅ Fetched ${data.length} quotes from Quotable API`);
        } catch (err) {
            console.log("⚠️  Quotable API unreachable. Using high-quality local fallback...");
            console.log(`   Error: ${err.message}`);
            data = fallbackQuotes;
        }

        // Map Quotable API format to our schema
        const quotesWithOwner = data.map(q => {
            return {
                text: q.content,           // Quotable uses 'content' for quote text
                author: q.author,          // Same field name
                category: mapTagToCategory(q.tags), // Map tags to our categories
                tags: q.tags || [],        // Quotable provides tags array
                owner: user._id,
                likes: []
            };
        });

        // Prevent duplicates by checking if quote text already exists
        const existingQuotes = await Quotes.find({
            text: { $in: quotesWithOwner.map(q => q.text) }
        });

        const existingTexts = new Set(existingQuotes.map(q => q.text));
        const uniqueQuotes = quotesWithOwner.filter(q => !existingTexts.has(q.text));

        if (uniqueQuotes.length === 0) {
            console.log("ℹ️  All fetched quotes already exist in database.");
            return;
        }

        await Quotes.insertMany(uniqueQuotes);
        console.log(`✅ DB seeded successfully with ${uniqueQuotes.length} premium quotes!`);

        if (uniqueQuotes.length < quotesWithOwner.length) {
            console.log(`   (Skipped ${quotesWithOwner.length - uniqueQuotes.length} duplicates)`);
        }

    } catch (err) {
        console.error("❌ Error seeding DB:", err.message);
        console.log("   Please check your database connection and try again.");
    }
}

module.exports = seedDB;