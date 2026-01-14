const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const adminAuth = require('./middleware/auth');

const app = express();
const PORT = 5002;
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
require('dotenv').config();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser()); 
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Database connection error:', err));
// Protected Routes
app.use('/students', adminAuth, require('./routes/students'));
app.use('/courses', adminAuth, require('./routes/courses'));
app.use('/enrollments', adminAuth, require('./routes/enrollments'));

// Homepage Route (Protected)
app.get('/', adminAuth, (req, res) => {
    res.render('admin');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
