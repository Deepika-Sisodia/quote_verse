
const mongoose = require('mongoose');
const Quotes = require('../models/Quote');
const fs = require('fs');
require('dotenv').config({ path: __dirname + '/../.env' });

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/Quote';

async function debugData() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('Connected to DB');

        const quotes = await Quotes.find().limit(20);

        fs.writeFileSync('quotes_dump.json', JSON.stringify(quotes, null, 2));
        console.log('Dumped 20 quotes to quotes_dump.json');

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

debugData();
