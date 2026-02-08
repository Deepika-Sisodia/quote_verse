const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isLoggedIn = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log("🔒 Auth Failed: Missing or invalid token format");
            return res.status(401).json({ msg: "Authentication required. Please login." });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            console.log("🔒 Auth Failed: User not found in DB");
            return res.status(401).json({ msg: "User no longer exists." });
        }

        req.user = user;
        next();
    } catch (err) {
        console.log("🔒 Auth Failed: Token verification error", err.message);
        res.status(401).json({ msg: "Invalid or expired token." });
    }
};

module.exports = { isLoggedIn };
