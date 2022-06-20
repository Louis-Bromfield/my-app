const express = require('express');
const router = express.Router();
const { extract } = require('article-parser');
const Feedback = require('../models/Feedback');

const getArticleHeadline = async (url) => {
    try {
        const article = await extract(url);
        return [ article.title, article.image ];
    } catch (error) {
        console.error(error);
    };
};

// Get post info for post preview
router.get("/getPostInfo", async (req, res) => {
    try {
        if (req.query.URL === "" || req.query.URL.length === 0) {
            res.json({});
        } else {
            let [ articleTitle, articleImage ] = await getArticleHeadline(req.query.URL);
            res.json({ articleTitle: articleTitle, articleImage: articleImage });
        }
    } catch (error) {
        console.error("Error in HomePageNewsFeedPosts > getPostInfo");
        console.error(error);
        res.json({ error: "Error" });
    };
});

// Submit feedback
router.post("/submitFeedback", async (req, res) => {
    try {
        const feedbackToSubmit = new Feedback({
            reportType: req.body.reportType,
            reportComments: req.body.reportComments,
            reportDate: new Date().toString()
        })
        const feedback = await feedbackToSubmit.save();
        res.status(200).json(feedback);
    } catch (error) {
        console.error("Error in helpers > submitFeedback");
        console.error(error);
        res.json({ error: "Error" });
    };
});

// Session auth middleware
const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    } else {
        console.log("no");
        console.log(req.session);
        console.log(req.session.isAuth);
        res.redirect("/login");
    }
};

module.exports = router;