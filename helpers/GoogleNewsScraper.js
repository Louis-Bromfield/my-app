const GoogleNewsRSS = require('google-news-rss');
const googleNews = new GoogleNewsRSS();

const getGoogleArticles = async (searchTerm) => {
    try {
        let articles = await googleNews.search(searchTerm);
        articles = articles.slice(0, 8);
        return articles;
    } catch (error) {
        console.log("ERROR");
        console.error(error);
    }
}
// getGoogleArticles("Trump");
module.export = getGoogleArticles;