import React, { useState } from 'react';
import axios from 'axios';
import './ForecastArticlesDisplay.css';

function ForecastArticlesDisplay(props) {
    const [articles, setArticles] = useState("loading");

    // const googleNewsScrape = async (searchTerm) => {
    //     try {
    //         let term = "2024 US Election";
    //         let googleNewsScrapeResult = await axios.get(`${process.env.REACT_APP_API_CALL_GSN}/${term}`);
    //         setArticles(googleNewsScrapeResult.data);
    //     } catch (error) {
    //         console.error(error);
    //     };
    // };

    const logUserAction = async (username) => {
        try {
            await axios.patch(`${process.env.REACT_APP_API_CALL_U}/${username}`, {
                articleVisits: props.userObject.articleVisits + 1
            });
            props.userObject.articleVisits++;
        } catch (err) {
            console.error("Error in logging user action");
            console.error(err);
        };
    };

        return (
            <div className="articles">
                <div className="articles-header">
                    <h2 className="new-forecast-input-header">Articles</h2>
                    <h4>The following articles are here to help provide some context for the US Presidential Election.</h4>
                </div>
                <div className="articles-grid">
                    <a href="https://projects.fivethirtyeight.com/polls/president-general/2024/national/?ex_cid=abcpromo" rel="noreferrer" target="_blank" style={{ "textDecoration": "none"}}>
                        <div className="article-list-item" onClick={() => logUserAction(props.username === undefined ? props.userObject.username : props.username)}>
                            <div className="article-list-item-img-container">
                                <img className="article-list-item-img" src="https://projects.fivethirtyeight.com/2024-election-forecast/images/state_probabilities.svg?v=1a79a04d" alt="" />
                            </div>
                            <div className="article-list-item-text-div">
                                <h3 className="article-list-item-title">538: Who’s ahead in the national polls?</h3>
                            </div>
                        </div>
                    </a>
                    <a href="https://news.sky.com/story/us-election-poll-tracker-who-is-favourite-to-win-check-the-latest-polls-and-play-our-game-to-predict-who-you-think-will-win-13211891" rel="noreferrer" target="_blank" style={{ "textDecoration": "none"}}>
                        <div className="article-list-item" onClick={() => logUserAction(props.username === undefined ? props.userObject.username : props.username)}>
                            <div className="article-list-item-img-container">
                                <img className="article-list-item-img" src="https://e3.365dm.com/24/09/2048x1152/skynews-harris-trump-debate_6680706.jpg?20240910010052" alt="" />
                            </div>
                            <div className="article-list-item-text-div">
                                <h3 className="article-list-item-title">Sky News: US election poll tracker: Who is favourite to win?</h3>
                            </div>
                        </div>
                    </a>
                    <a href="https://www.bbc.co.uk/news/articles/c511pyn3xw3o" rel="noreferrer" target="_blank" style={{ "textDecoration": "none"}}>
                        <div className="article-list-item" onClick={() => logUserAction(props.username === undefined ? props.userObject.username : props.username)}>
                            <div className="article-list-item-img-container">
                                <img className="article-list-item-img" src="https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/727d/live/dde1d440-74fc-11ef-8c1a-df523ba43a9a.png.webp" alt="" />
                            </div>
                            <div className="article-list-item-text-div">
                                <h3 className="article-list-item-title">BBC News: Seven swing states set to decide the 2024 US election</h3>
                            </div>
                        </div>
                    </a>
                    {/* <hr />
                    <h4>These articles have been scraped from Google News:</h4>
                    {articles.map((article, index) => {
                        if (article.img === "N/A") {
                            article.img = PlaceholderIcon;
                        }
                        return (
                            // <li>
                                <a href={article.link} rel="noreferrer" target="_blank" key={index} style={{ "textDecoration": "none"}}>
                                    <div className="article-list-item">
                                        <div className="article-list-item-img-container">
                                            <img className="article-list-item-img" src={article.img} alt="" />
                                        </div>
                                        <div className="article-list-item-text-div">
                                            <h3 className="article-list-item-title">{article.title}</h3>
                                            <hr />
                                            <h5 className="article-list-item-publisher">{article.source}</h5>
                                        </div>
                                    </div>
                                </a>
                        )
                    })} */}
                </div>
            </div>
        )
    // }
}

export default ForecastArticlesDisplay;
