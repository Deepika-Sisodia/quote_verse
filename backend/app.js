require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const seedDB = require('./seed');
const quoteRoutes = require('./api/quoteRoutes');
const userRoutes = require('./api/userRoutes');

/* =========================
   DATABASE CONNECTION
========================= */

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/Quote';

mongoose.connect(MONGO_URL)
    .then(() => console.log('✅ DB Connected'))
    .catch(err => console.error('❌ DB Connection Error:', err));

/* =========================
   CORS CONFIGURATION
========================= */

const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL
].filter(Boolean); // removes undefined values

app.use(cors({
    origin: function (origin, callback) {
        // allow server-to-server & health checks
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    credentials: true
}));

/* =========================
   MIDDLEWARES
========================= */

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Log requests only in development
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });
}

/* =========================
   ROUTES
========================= */

app.use('/', quoteRoutes);
app.use('/', userRoutes);

/* =========================
   HEALTH CHECK
========================= */

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        db: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
    console.error('ERROR:', err.stack);
    res.status(500).json({
        msg: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

/* =========================
   SEED DATABASE (DEV ONLY)
========================= */

if (process.env.NODE_ENV !== 'production') {
    seedDB();
}

/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
