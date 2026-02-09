
const mongoose = require('mongoose');
const Quotes = require('../models/Quote');
const User = require('../models/User'); // Required for schema registration
require('dotenv').config({ path: __dirname + '/../.env' });

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/Quote';

async function countQuotes() {
    try {
        await mongoose.connect(MONGO_URL);
        const count = await Quotes.countDocuments();
        console.log(`TOTAL_QUOTES_IN_DB: ${count}`);
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

countQuotes();
