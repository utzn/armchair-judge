const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());

// Generate a random session secret
const sessionSecret = crypto.randomBytes(64).toString('hex');

app.use(
    session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false, // Set to true if using HTTPS
            maxAge: 24 * 60 * 60 * 1000, // Session expiration in milliseconds
        },
    })
);

// **API Routes**
app.use('/api', apiRoutes);

// **Serve Static Files**
app.use(express.static(path.join(__dirname, 'public')));

// **Catch-All Route** (must be after `express.static`)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// MongoDB Connection
mongoose
    .connect('mongodb://mongo:27017/boxing-app', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});