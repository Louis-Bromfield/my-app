import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ForecastArticlesDisplay.css';
import PlaceholderIcon from '../../../media/sd.png';
import ReactLoading from 'react-loading';

function ForecastArticlesDisplay(props) {
    const [articles, setArticles] = useState("loading");

    const googleNewsScrape = async (searchTerm) => {
        try {
            let term = "Georgia Senate";
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
            // if (searchTerm.includes("DeSantis")) {
            //     term = "DeSantis"
            // } else if (searchTerm.includes("Fetterman")) {
            //     term = "Fetterman Oz"
            // } else {
            //     term = "US Midterms"
            // };

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
                <hr />
                {articles !== "loading" && <div className="articles-grid">
                    {/* <ul> */}
                        <h4>These articles have been handpicked by us:</h4>
                        <a href="https://www.npr.org/2022/11/09/1135685554/runoff-election-georgia-senate-race-raphael-warnock-herschel-walker" rel="noreferrer" target="_blank" style={{ "textDecoration": "none"}}>
                            {/* <p>{article.title}</p> */}
                            <div className="article-list-item">
                                <div className="article-list-item-img-container">
                                    <img className="article-list-item-img" src="https://media.npr.org/assets/img/2022/11/09/gettyimages-1440117548-1137e85c8b9a57b106b19cac51902341a0cb5ad8-s800-c85.webp" alt="" />
                                </div>
                                <div className="article-list-item-text-div">
                                    <h3 className="article-list-item-title">What is a runoff election? Let's break down what's happening in Georgia</h3>
                                    {/* <p className="article-list-item-description">{article.description}</p> */}
                                    <hr />
                                    <h5 className="article-list-item-publisher">NPR</h5>
                                </div>
                            </div>
                        </a>
                        <a href="https://projects.fivethirtyeight.com/polls/senate/2022/georgia/" rel="noreferrer" target="_blank" style={{ "textDecoration": "none"}}>
                            {/* <p>{article.title}</p> */}
                            <div className="article-list-item">
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
                        <a href="https://www.cbsnews.com/news/runoff-election-georgia-senate-2022-raphael-warnock-herschel-walker/" rel="noreferrer" target="_blank" style={{ "textDecoration": "none"}}>
                            {/* <p>{article.title}</p> */}
                            <div className="article-list-item">
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
