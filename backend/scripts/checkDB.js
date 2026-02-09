const mongoose = require('mongoose');
const User = require('../models/User');
const Quotes = require('../models/Quote');
require('dotenv').config({ path: __dirname + '/../.env' });

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/Quote';

async function checkQuotes() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('Connected to DB');

        const count = await Quotes.countDocuments();
        console.log(`Total quotes: ${count}`);

        const quotes = await Quotes.find().limit(5);
        console.log('Sample quotes:');
        quotes.forEach(q => {
            console.log(JSON.stringify({
                id: q._id,
                text: q.text.substring(0, 20) + '...',
                author: q.author,
                category: q.category
            }, null, 2));
        });

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkQuotes();
