const express = require('express');
const router = express.Router();
const LearnQuizzes = require('../models/LearnQuizzes');
const cors = require('cors');

// Get all posts
router.get("/", cors(), async (req, res) => {
    const allUserLearns = await LearnQuizzes.find();
    res.json(allUserLearns);
});

// Get one user's learn info
router.get("/:username", cors(), async (req, res) => {
    try {
        const userLearn = await LearnQuizzes.findOne({ username: req.params.username });
        res.json(userLearn);
    } catch (error) {
        res.json({ message: error.message });
    }
});

// Update a user's learn document (e.g. upon quiz completion)
router.patch("/:username", cors(), async (req, res) => {
    try {
        const document = await LearnQuizzes.findOne({ username: req.params.username });
        const updatedUserLearn = await LearnQuizzes.findByIdAndUpdate(document._id,
            {
                username: req.body.username,
                brierComplete: req.body.brierComplete,
                gjpComplete: req.body.gjpComplete,
                superforecastersComplete: req.body.superforecastersComplete,
            },
            { new: true }
        );
        res.json(updatedUserLearn);
    } catch (error) {
        res.json({ error: error.message });
    }
});

// Update when a user changes their username
router.patch("/changeUsername/:currentUsername", cors(), async (req, res) => {
    try {
        const userDoc = await LearnQuizzes.findOne({ username: req.params.currentUsername });
        const updatedUserDoc = await LearnQuizzes.findByIdAndUpdate(userDoc._id, { username: req.body.username }, { new: true });
        res.json(updatedUserDoc);
    } catch (error) {
        console.error("Error in learnQuizzes > patch username");
        console.error(error);
    }
})

// Add a new user to the learnquizzes collection
router.post("/", cors(), async (req, res) => {
    try {
        const newUserToPersist = new LearnQuizzes({
            username: req.body.username
        });
        const newUserSavedToDB = await newUserToPersist.save();
        res.status(200).json(newUserSavedToDB);
    } catch (error) {
        console.error("Error in learnQuizzes.js > post");
        console.error(error);
    }
});

module.exports = router;