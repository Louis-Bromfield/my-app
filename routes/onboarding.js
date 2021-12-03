const express = require('express');
const router = express.Router();
const Onboarding = require('../models/Onboarding');

// Get all onboarding booleans
router.get("/:username", async (req, res) => {
    try {
        const allOnboardingBooleans = await Onboarding.find({ username: req.params.username });
        res.json(allOnboardingBooleans);
    } catch (error) {
        
    }
});

// Update an onboarding boolean
router.patch("/:username", async (req, res) => {
    try {
        const document = await Onboarding.findOne({ username: req.params.username });
        const updatedOnboardingBooleans = await Onboarding.findByIdAndUpdate(document._id,
            {
                username: req.body.username,
                visitProfilePage: req.body.visitProfilePage,
                completeCalibration: req.body.completeCalibration,
                joinAMarket: req.body.joinAMarket,
                submitAPost: req.body.submitAPost,
                submitAForecast: req.body.submitAForecast,
                completeALearnQuiz: req.body.completeALearnQuiz
            },
            { new: true }
        );
        res.json(updatedOnboardingBooleans);
    } catch (error) {
        res.json({ error: error.message });
    }
});

module.exports = router;