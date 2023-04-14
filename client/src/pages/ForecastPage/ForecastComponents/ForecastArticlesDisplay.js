import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ForecastArticlesDisplay.css';
import PlaceholderIcon from '../../../media/sd.png';
import ReactLoading from 'react-loading';

function ForecastArticlesDisplay(props) {
    const [articles, setArticles] = useState("loading");

    const googleNewsScrape = async (searchTerm) => {
        try {
            let term = "UK Local Elections";
            let googleNewsScrapeResult;
            googleNewsScrapeResult = await axios.get(`${process.env.REACT_APP_API_CALL_GSN}/${term}`);
            setArticles(googleNewsScrapeResult.data);
        } catch (error) {
            console.error(error);
        };
    };

    const logUserAction = async (username) => {
        try {
            const res = await axios.patch(`${process.env.REACT_APP_API_CALL_U}/${username}`, {
                articleVisits: props.userObject.articleVisits + 1
            });
            props.userObject.articleVisits++;
        } catch (err) {
            console.error("Error in logging user action");
            console.error(err);
        };
    };

    useEffect(() => {
        setArticles("loading");
        googleNewsScrape(props.searchTerm.problemName);
    }, [props.searchTerm]);

    if (articles === "loading") {
        return <div className="articles-loading">
            {/* <h2>This section is under construction!</h2> */}
            <h2>Loading potentially useful articles...</h2>
            <ReactLoading type="bars" color="#404d72" height="15%" width="15%" />
        </div>
    } else {
        return (
            <div className="articles">
                <h2 style={{ color: "#404d72", margin: "0 auto"}}>Articles</h2>
                <h4 style={{ margin: "0 auto", textAlign: "center" }}>The articles shown below are generated from a web scrape of Google News using key words in the problem above. This can result in a wide variety in terms of their relevance and usefulness.</h4>
                <hr />
                {articles !== "loading" && <div className="articles-grid">
                    {/* <ul> */}
                        <h4>These articles have been handpicked by us:</h4>
                        {/* changed success */}
                        <a href="https://www.telegraph.co.uk/politics/2023/04/06/local-elections-may-2023-when-who-vote-where-polling/" rel="noreferrer" target="_blank" style={{ "textDecoration": "none"}}>
                            {/* <p>{article.title}</p> */}
                            <div className="article-list-item" onClick={() => logUserAction(props.username === undefined ? props.userObject.username : props.username)}>
                                <div className="article-list-item-img-container">
                                    <img className="article-list-item-img" src="https://www.telegraph.co.uk/content/dam/politics/2023/04/06/TELEMMGLPICT000331337931_trans_NvBQzQNjv4Bqx5egiJ9MQyAqq6uO2mksLR6vTgUo7goj1e1R4oK598Y.jpeg?imwidth=1280" alt="" />
                                </div>
                                <div className="article-list-item-text-div">
                                    <h3 className="article-list-item-title">Local elections 2023: When are they and which results to watch out for?</h3>
                                    {/* <p className="article-list-item-description">{article.description}</p> */}
                                    <hr />
                                    <h5 className="article-list-item-publisher">NPR</h5>
                                </div>
                            </div>
                        </a>
                        {/* change this one */}
                        <a href="https://projects.fivethirtyeight.com/polls/senate/2022/georgia/" rel="noreferrer" target="_blank" style={{ "textDecoration": "none"}}>
                            {/* <p>{article.title}</p> */}
                            <div className="article-list-item" onClick={() => logUserAction(props.username === undefined ? props.userObject.username : props.username)}>
                                <div className="article-list-item-img-container">
                                    <img className="article-list-item-img" src="https://s.abcnews.com/images/Business/fivethirtyeight-logo-v2-ht-ps2-180417_hpMain_16x9_992.jpg" alt="" />
                                </div>
                                <div className="article-list-item-text-div">
                                    <h3 className="article-list-item-title">Who's ahead in the Georgia Senate race?</h3>
                                    {/* <p className="article-list-item-description">{article.description}</p> */}
                                    <hr />
                                    <h5 className="article-list-item-publisher">FiveThirtyEight</h5>
                                </div>
                            </div>
                        </a>
                        {/* change this one */}
                        <a href="https://www.cbsnews.com/news/runoff-election-georgia-senate-2022-raphael-warnock-herschel-walker/" rel="noreferrer" target="_blank" style={{ "textDecoration": "none"}}>
                            {/* <p>{article.title}</p> */}
                            <div className="article-list-item" onClick={() => logUserAction(props.username === undefined ? props.userObject.username : props.username)}>
                                <div className="article-list-item-img-container">
                                    <img className="article-list-item-img" src="https://election-assets.cbsnewsstatic.com/general-2022/GA-S-D-RAPHAEL_WARNOCK.jpg" alt="" />
                                </div>
                                <div className="article-list-item-text-div">
                                    <h3 className="article-list-item-title">What is a runoff election, and how will it work in Georgia's Senate race?</h3>
                                    {/* <p className="article-list-item-description">{article.description}</p> */}
                                    <hr />
                                    <h5 className="article-list-item-publisher">CBS News</h5>
                                </div>
                            </div>
                        </a>
                        <hr />
                        <h4>These articles have been scraped from Google News:</h4>
                        {articles.map((article, index) => {
                            if (article.img === "N/A") {
                                article.img = PlaceholderIcon;
                            }
                            return (
                                // <li>
                                    <a href={article.link} rel="noreferrer" target="_blank" key={index} style={{ "textDecoration": "none"}}>
                                        {/* <p>{article.title}</p> */}
                                        <div className="article-list-item">
                                            <div className="article-list-item-img-container">
                                                <img className="article-list-item-img" src={article.img} alt="" />
                                            </div>
                                            <div className="article-list-item-text-div">
                                                <h3 className="article-list-item-title">{article.title}</h3>
                                                {/* <p className="article-list-item-description">{article.description}</p> */}
                                                <hr />
                                                <h5 className="article-list-item-publisher">{article.source}</h5>
                                            </div>
                                        </div>
                                    </a>
                                // </li>
                            )
                        })}
                    {/* </ul> */}
                </div>}
            </div>
        )
    }
}

export default ForecastArticlesDisplay;
