require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const axios = require('axios');
const Quote = require('../models/Quote');
const User = require('../models/User');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/Quote';

async function seedFromQuotable() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('Connected to DB for seeding...');

        // Find or create a default admin user to own these quotes
        let admin = await User.findOne({ username: 'admin' });
        if (!admin) {
            console.log('Admin user not found. Creating default admin user...');
            admin = await User.create({
                username: 'admin',
                email: 'admin@example.com',
                password: 'adminpassword123' // They should change this
            });
            console.log('Admin user created successfully.');
        }

        console.log(`Using user "${admin.username}" (${admin._id}) as owner.`);

        console.log('Fetching quotes from ZenQuotes API...');
        const response = await axios.get('https://zenquotes.io/api/quotes');
        const externalQuotes = response.data;

        let addedCount = 0;
        let skipCount = 0;

        const categories = ['Inspirational', 'Life', 'Success', 'Funny', 'Wisdom', 'Other'];

        for (const q of externalQuotes) {
            // ZenQuotes uses 'q' for quote and 'a' for author
            const exists = await Quote.findOne({ text: q.q });
            if (!exists) {
                const randomCategory = categories[Math.floor(Math.random() * categories.length)];
                await Quote.create({
                    text: q.q,
                    author: q.a,
                    category: randomCategory,
                    tags: ['motivation', randomCategory.toLowerCase()],
                    owner: admin._id
                });
                addedCount++;
            } else {
                skipCount++;
            }
        }

        console.log(`Seeding complete! Added: ${addedCount}, Skipped: ${skipCount} (duplicates)`);
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error.message);
        process.exit(1);
    }
}

seedFromQuotable();
