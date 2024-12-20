const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Scorecard = require('../models/Scorecard');
const Match = require('../models/Match'); // Import the Match model

// Middleware to require login
function requireLogin(req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
}

// Middleware to check if user is admin (gamemaster)
function requireAdmin(req, res, next) {
    if (req.session.firstName.toLowerCase() !== 'utz') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
}

// User Login Route
router.post('/login', async (req, res) => {
    const { firstName, password } = req.body;
    const commonPasswordPart = process.env.COMMON_PASSWORD_PART || 'helloabc'; // Default to 'helloabc' if not set
    const expectedPassword = `${commonPasswordPart}-${firstName}`;

    if (password !== expectedPassword) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    try {
        // Check if user exists
        let user = await User.findOne({ firstName });
        if (!user) {
            user = new User({ firstName });
            await user.save();
        }

        // Set session variables
        req.session.userId = user._id;
        req.session.firstName = user.firstName;

        res.json({
            userId: user._id,
            firstName: user.firstName,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Start Match
router.post('/start-match', requireLogin, requireAdmin, async (req, res) => {
    try {
        let match = await Match.findOne();
        if (!match) {
            return res.status(400).json({ message: 'No match found' });
        }

        match.currentRound = 1;
        match.status = 'ongoing';
        await match.save();

        res.json({ message: 'Match started', match });
    } catch (error) {
        console.error('Start Match error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit Scorecard Route
router.post('/scorecard', requireLogin, async (req, res) => {
    const { score, boxer } = req.body;

    // Validate score input (Acceptable scores: '10-10', '10-9', '10-8')
    const validScores = ['10-10', '10-9', '10-8'];
    if (!validScores.includes(score)) {
        return res.status(400).json({ message: 'Invalid score input' });
    }

    if (!['A', 'B'].includes(boxer)) {
        return res.status(400).json({ message: 'Invalid boxer selection' });
    }

    try {
        // Get the current match
        const match = await Match.findOne();
        if (!match || match.status !== 'ongoing') {
            return res.status(400).json({ message: 'No ongoing match' });
        }

        const currentRound = match.currentRound;

        // Check if the user has already submitted a score for the current round
        const existingScore = await Scorecard.findOne({
            userId: req.session.userId,
            round: currentRound,
        });

        if (existingScore) {
            return res
                .status(400)
                .json({ message: 'You have already submitted a score for this round' });
        }

        const scorecard = new Scorecard({
            userId: req.session.userId,
            round: currentRound,
            score,
            boxer,
        });
        await scorecard.save();
        res.json({ message: 'Score submitted successfully' });
    } catch (error) {
        console.error('Submit Scorecard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Scorecards Route
router.get('/scorecards', requireLogin, async (req, res) => {
    try {
        const scorecards = await Scorecard.find()
            .populate('userId', 'firstName')
            .sort({ round: 1 });

        res.json(scorecards);
    } catch (error) {
        console.error('Get Scorecards error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Current Match Info
router.get('/match', requireLogin, async (req, res) => {
    try {
        const match = await Match.findOne();
        res.json(match);
    } catch (error) {
        console.error('Get Match Info error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin Routes for 'utz'

// Set Boxers
router.post('/set-boxers', requireLogin, requireAdmin, async (req, res) => {
    const { boxerA, boxerB } = req.body;

    if (!boxerA || !boxerB) {
        return res.status(400).json({ message: 'Boxer names are required' });
    }

    try {
        // Create a new match or update the existing one
        let match = await Match.findOne();
        if (!match) {
            match = new Match({ boxerA, boxerB, status: 'not started' });
        } else {
            match.boxerA = boxerA;
            match.boxerB = boxerB;
            match.status = 'not started';
        }
        await match.save();
        res.json({ message: 'Match set successfully', match });
    } catch (error) {
        console.error('Set Boxers error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Call Next Round
router.post('/next-round', requireLogin, requireAdmin, async (req, res) => {
    try {
        const match = await Match.findOne();
        if (!match || match.status !== 'ongoing') {
            return res.status(400).json({ message: 'No ongoing match found' });
        }

        match.currentRound += 1;
        await match.save();

        res.json({ message: `Advanced to round ${match.currentRound}`, match });
    } catch (error) {
        console.error('Next Round error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// End Fight
router.post('/end-fight', requireLogin, requireAdmin, async (req, res) => {
    try {
        const match = await Match.findOne();
        if (!match) {
            return res.status(400).json({ message: 'No match found' });
        }

        match.status = 'ended';
        await match.save();

        res.json({ message: 'Fight ended', match });
    } catch (error) {
        console.error('End Fight error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
