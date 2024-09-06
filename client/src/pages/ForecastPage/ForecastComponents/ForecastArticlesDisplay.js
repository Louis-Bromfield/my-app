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
                    {/* <h4 style={{ margin: "0 auto" }}>The articles shown below are generated from a web scrape of Google News using key words in the problem above. This can result in a wide variety in terms of their relevance and usefulness.</h4> */}
                </div>
                <div className="articles-grid">
                    {/* <h4>These articles have been handpicked by us:</h4> */}
                    <a href="https://www.telegraph.co.uk/politics/2023/04/06/local-elections-may-2023-when-who-vote-where-polling/" rel="noreferrer" target="_blank" style={{ "textDecoration": "none"}}>
                        {/* <p>{article.title}</p> */}
                        <div className="article-list-item" onClick={() => logUserAction(props.username === undefined ? props.userObject.username : props.username)}>
                            <div className="article-list-item-img-container">
                                <img className="article-list-item-img" src="https://www.telegraph.co.uk/content/dam/politics/2023/04/06/TELEMMGLPICT000331337931_trans_NvBQzQNjv4Bqx5egiJ9MQyAqq6uO2mksLR6vTgUo7goj1e1R4oK598Y.jpeg?imwidth=1280" alt="" />
                            </div>
                            <div className="article-list-item-text-div">
                                <h3 className="article-list-item-title">NPR: Local elections 2023: When are they and which results to watch out for?</h3>
                                <hr />
                            </div>
                        </div>
                    </a>
                    {/* change this one */}
                    <a href="https://www.bbc.co.uk/news/uk-politics-65013652" rel="noreferrer" target="_blank" style={{ "textDecoration": "none"}}>
                        {/* <p>{article.title}</p> */}
                        <div className="article-list-item" onClick={() => logUserAction(props.username === undefined ? props.userObject.username : props.username)}>
                            <div className="article-list-item-img-container">
                                <img className="article-list-item-img" src="https://ichef.bbci.co.uk/news/976/cpsprodpb/C1B7/production/_129219594_le_2023_index_promo_guide_to_elections_v2-nc.jpg.webp" alt="" />
                            </div>
                            <div className="article-list-item-text-div">
                                <h3 className="article-list-item-title">BBC News: Local elections 2023: When are they and who can vote?</h3>
                                <hr />
                            </div>
                        </div>
                    </a>
                    <a href="https://www.bbc.co.uk/news/uk-politics-65190787" rel="noreferrer" target="_blank" style={{ "textDecoration": "none"}}>
                        <div className="article-list-item" onClick={() => logUserAction(props.username === undefined ? props.userObject.username : props.username)}>
                            <div className="article-list-item-img-container">
                                <img className="article-list-item-img" src="https://ichef.bbci.co.uk/news/976/cpsprodpb/11240/production/_129280207_le_2023_nick_eardley-nc.jpg.webp" alt="" />
                            </div>
                            <div className="article-list-item-text-div">
                                <h3 className="article-list-item-title">BBC News: Local elections 2023: What to expect from May's polls in England</h3>
                                <hr />
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
