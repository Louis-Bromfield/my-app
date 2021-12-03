const express = require('express');
const router = express.Router();
const { extract } = require('article-parser');

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

module.exports = router;