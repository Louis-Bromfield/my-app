const express = require('express');
const router = express.Router();
const GoogleNewsRSS = require('google-news-rss');
const { extract } = require('article-parser');
const cors = require('cors');

// Get all articles
router.get("/:searchTerm", cors(), async (req, res) => {
    try {
        const googleNews = new GoogleNewsRSS();
        let articles = await googleNews.search(req.params.searchTerm);
        articles = articles.slice(0, 12);
        for (let i = 0; i < articles.length; i++) {
            try {
                let extractedArticle = await extract(articles[i].link);
                articles[i].img = extractedArticle.image;
                if (articles[i].img === "") articles[i].img = "N/A";
            } catch (error) {
                articles[i].img = "N/A";
            };
        };
        let newArticles = trimArticleText(articles);
        res.send(newArticles);
    } catch (error) {
        console.error(error);
    }
});

const trimArticleText = (articles) => {
    for (let i = 0; i < articles.length; i++) {
        // Trim titles
        if (articles[i].title.length >= 100) {
            articles[i].title = `${articles[i].title.slice(0, 99)}...`;
        };
        // Trim descriptions
        if (articles[i].description.length >= 120) {
            articles[i].description = `${articles[i].description.slice(0, 119)}...`;
        };
        // Destructure publishers object
        const {_, $} = articles[i].source;
        articles[i].source = _;
    };
    return articles;
}

module.exports = router;