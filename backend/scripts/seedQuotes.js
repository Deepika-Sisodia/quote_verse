#!/usr/bin/env node

/**
 * Standalone Seeding Script for QuoteVerse
 * 
 * This script fetches high-quality quotes from the Quotable API
 * and seeds them into the MongoDB database.
 */

require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Quotes = require('../models/Quote');
const User = require('../models/User');
const axios = require('axios');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/Quote';

function mapTagToCategory(tags) {
    if (!tags || tags.length === 0) return 'Wisdom';
    const tagArray = Array.isArray(tags) ? tags : [tags];
    const tagLower = tagArray[0]?.toLowerCase() || '';

    if (tagLower.includes('inspirational') || tagLower.includes('motivational')) return 'Inspirational';
    if (tagLower.includes('life') || tagLower.includes('living')) return 'Life';
    if (tagLower.includes('success') || tagLower.includes('achievement')) return 'Success';
    if (tagLower.includes('humor') || tagLower.includes('funny')) return 'Funny';
    if (tagLower.includes('wisdom') || tagLower.includes('philosophy')) return 'Wisdom';
    return 'Other';
}

async function seedQuotes() {
    try {
        console.log('🚀 Starting seeding process...');
        await mongoose.connect(MONGO_URL);
        console.log('✅ Connected to MongoDB');

        let user = await User.findOne();
        if (!user) {
            console.log("⚠️  No user found. Creating system user...");
            user = await User.create({
                username: 'system_admin',
                name: 'System Admin',
                email: 'admin@quoteverse.com',
                password: 'securepassword123'
            });
        }
        console.log(`👤 Using user: ${user.username} (${user._id})`);

        let data = [];
        try {
            console.log("⏳ Fetching 150 quotes from Quotable API...");
            // Sequential to avoid rate limits
            console.log("Fetching page 1...");
            const res1 = await axios.get('https://api.quotable.io/quotes?limit=50&page=1');
            console.log("Fetching page 2...");
            const res2 = await axios.get('https://api.quotable.io/quotes?limit=50&page=2');

            data = [...res1.data.results, ...res2.data.results];
            console.log(`✅ Successfully fetched ${data.length} quotes from Quotable.`);
        } catch (err) {
            console.error("⚠️ Quotable API Error:", err.message);
            console.log("🔄 Switching to DummyJSON Quotes API...");

            try {
                const res = await axios.get('https://dummyjson.com/quotes?limit=100');
                // Map DummyJSON format (id, quote, author) to our format
                data = res.data.quotes.map(q => ({
                    content: q.quote,
                    author: q.author,
                    tags: [] // DummyJSON doesn't have tags, mapTagToCategory will handle valid default
                }));
                console.log(`✅ Fetched ${data.length} quotes from DummyJSON.`);
            } catch (fallbackErr) {
                console.error("❌ All APIs failed:", fallbackErr.message);
                data = fallbackQuotes;
            }
        }

        const quotesWithOwner = data.map(q => ({
            text: q.content,
            author: q.author,
            category: mapTagToCategory(q.tags),
            tags: q.tags || [],
            owner: user._id,
            likes: []
        }));

        console.log(`🔍 Checking for duplicates against ${quotesWithOwner.length} fetched quotes...`);

        // Use a Set for faster local deduplication of fetched data
        const uniqueFetched = [];
        const seenTexts = new Set();
        for (const q of quotesWithOwner) {
            if (!seenTexts.has(q.text)) {
                seenTexts.add(q.text);
                uniqueFetched.push(q);
            }
        }
        console.log(`ℹ️  Deduplicated fetched quotes: ${uniqueFetched.length}`);

        // Check against DB
        const existingQuotes = await Quotes.find({}, { text: 1 });
        const existingTexts = new Set(existingQuotes.map(q => q.text));
        console.log(`📊 DB currently has ${existingQuotes.length} quotes.`);

        const toInsert = uniqueFetched.filter(q => !existingTexts.has(q.text));

        if (toInsert.length > 0) {
            console.log(`📝 Inserting ${toInsert.length} new quotes...`);
            await Quotes.insertMany(toInsert);
            console.log("✅ Insertion complete!");
        } else {
            console.log("ℹ️  No new quotes to insert (all duplicates).");
        }

        const finalCount = await Quotes.countDocuments();
        console.log(`\n🎉 Final DB Count: ${finalCount}`);

    } catch (err) {
        console.error("❌ Fatal Error:", err);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seedQuotes();
