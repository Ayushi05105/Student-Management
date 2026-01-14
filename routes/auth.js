const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const adminAuth = require('../middleware/auth');

// Render the login page
router.get('/login', (req, res) => {
    res.render('login');  // Make sure you have a 'login.ejs' file in the views folder
});

// Handle login form submission
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.render('login', { error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.render('login', { error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.render('login', { error: 'An error occurred. Please try again.' });
    }
});


// Render the signup page
router.get('/admin/signup', (req, res) => {
    res.render('signup');  
});

// Handle signup form submission
router.post('/admin/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.render('signup', { error: 'Email already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin
        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword,
        });
        await newAdmin.save();

        // Generate JWT token
        const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/admin');  // Redirect to admin dashboard after signup
    } catch (err) {
        console.error(err);
        res.render('signup', { error: 'An error occurred. Please try again.' });
    }
});

// Logout Admin
router.post('/logout', (req, res) => {
    res.clearCookie('token');  // Remove the JWT token cookie
    res.redirect('login');  // Redirect to login page
});


module.exports = router;
