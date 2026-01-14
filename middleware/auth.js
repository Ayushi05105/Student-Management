const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
    // Check if req and res are defined
    if (!req || !res) {
        console.error("Request or Response object is undefined.");
        return;
    }

    const token = req.cookies?.token;  // Safe navigation to avoid undefined error

    if (!token) {
        console.log("No token found. Redirecting to login.");
        return res.redirect('/auth/login');  // Redirect to login if token is missing
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Replace with your secret key
        req.admin = decoded;
        next();
    } catch (err) {
        console.error("Invalid token. Redirecting to login:", err);
        return res.redirect('/auth/login');  // Redirect if token is invalid
    }
};

module.exports = adminAuth;
