import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ForecastArticlesDisplay.css';
import PlaceholderIcon from '../../../media/sd.png';
import ReactLoading from 'react-loading';

function ForecastArticlesDisplay(props) {
    const [articles, setArticles] = useState("loading");

    const googleNewsScrape = async (searchTerm) => {
        try {
            let term;
            let googleNewsScrapeResult;
            // if (searchTerm.includes("Wakefield")) {
            //     term = "Wakefield by-election";
            // } else if (searchTerm.includes("Tiverton") || searchTerm.includes("Honiton")) {
            //     term = "Tiverton and Honiton"
            // } else if (searchTerm.includes("Boris") || searchTerm.includes("Johnson")) {
            //     term = "Boris Johnson";
            // } else if (searchTerm.includes("Kier") || searchTerm.includes("Starmer")) {
            //     term = "Kier Starmer";
            // } else if (searchTerm.includes("Starmer")) {
            //     term = "Starmer";
            // } else if (searchTerm.includes("poll")) {
            //     term = "UK poll";
            // } else if (searchTerm.includes("Scotland") || searchTerm.includes("Independence")) {
            //     term = "Indyref";
            // } else if (searchTerm.includes("General Elections")) {
            //     term = "General Election";
            // } else if (searchTerm.includes("Cabinet")) {
            //     term = "Johnson Cabinet";
            // } else {
            //     term = "UK Politics";
            // };


            // For now, use "US Midterms as search term" and then when problems are decided add handling for each one:
            term = "US Midterms"
            
            // googleNewsScrapeResult = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/googleNewsScraper/${term}`);
            googleNewsScrapeResult = await axios.get(`${process.env.REACT_APP_API_CALL_GSN}/${term}`);
            setArticles(googleNewsScrapeResult.data);
        } catch (error) {
            console.error(error);
        };
    };

    useEffect(() => {
        console.log(props);
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
                {articles !== "loading" && <div className="articles-grid">
                    {/* <ul> */}
                        <a href="https://projects.fivethirtyeight.com/biden-approval-rating/" rel="noreferrer" target="_blank" style={{ "textDecoration": "none"}}>
                            {/* <p>{article.title}</p> */}
                            <div className="article-list-item">
                                <div className="article-list-item-img-container">
                                    <img className="article-list-item-img" src="https://s.abcnews.com/images/Business/fivethirtyeight-logo-v2-ht-ps2-180417_hpMain_16x9_992.jpg" alt="" />
                                </div>
                                <div className="article-list-item-text-div">
                                    <h3 className="article-list-item-title">How Popular is Joe Biden?</h3>
                                    {/* <p className="article-list-item-description">{article.description}</p> */}
                                    <hr />
                                    <h5 className="article-list-item-publisher">FiveThirtyEight</h5>
                                </div>
                            </div>
                        </a>
                        <a href="https://www.bbc.co.uk/news/world-us-canada-61274333" rel="noreferrer" target="_blank" style={{ "textDecoration": "none"}}>
                            {/* <p>{article.title}</p> */}
                            <div className="article-list-item">
                                <div className="article-list-item-img-container">
                                    <img className="article-list-item-img" src="https://ichef.bbci.co.uk/news/976/cpsprodpb/3475/production/_127292431_pin_badger_update-nc.jpg.webp" alt="" />
                                </div>
                                <div className="article-list-item-text-div">
                                    <h3 className="article-list-item-title">What are the US midterms? A simple guide</h3>
                                    {/* <p className="article-list-item-description">{article.description}</p> */}
                                    <hr />
                                    <h5 className="article-list-item-publisher">BBC News</h5>
                                </div>
                            </div>
                        </a>
                        <a href="https://www.theguardian.com/us-news/2022/oct/06/us-midterm-elections-explainer" rel="noreferrer" target="_blank" style={{ "textDecoration": "none"}}>
                            {/* <p>{article.title}</p> */}
                            <div className="article-list-item">
                                <div className="article-list-item-img-container">
                                    <img className="article-list-item-img" src="https://i.guim.co.uk/img/media/ab3aa1cd86a992b571c457f6c0df6ec5398d2f21/0_0_5000_3000/master/5000.jpg?width=1900&quality=85&dpr=1&s=none" alt="" />
                                </div>
                                <div className="article-list-item-text-div">
                                    <h3 className="article-list-item-title">What are the US midterm elections and who’s running?</h3>
                                    {/* <p className="article-list-item-description">{article.description}</p> */}
                                    <hr />
                                    <h5 className="article-list-item-publisher">The Guardian</h5>
                                </div>
                            </div>
                        </a>
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
