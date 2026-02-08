require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const seedDB = require('./seed');
const quoteRoutes = require('./api/quoteRoutes');
const userRoutes = require('./api/userRoutes');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/Quote';

mongoose.connect(MONGO_URL)
    .then(() => { console.log('✅ DB Connected') })
    .catch((err) => { console.log('❌ DB Connection Error:', err) });

const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/', quoteRoutes);
app.use('/', userRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        db: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

const fs = require('fs');
const path = require('path');

app.use((err, req, res, next) => {
    console.error("ERROR:", err.stack);
    res.status(500).json({
        msg: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

seedDB(); // Seed the database with high-quality quotes

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})