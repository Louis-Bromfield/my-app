import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ForecastArticlesDisplay.css';
import PlaceholderIcon from '../../../media/sd.png';
import ReactLoading from 'react-loading';

function ForecastArticlesDisplay(props) {
    const [articles, setArticles] = useState("loading");

    const googleNewsScrape = async (searchTerm, market) => {
        try {
            if (market === "French Presidential Election 2022") {
                const googleNewsScrapeResult = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/googleNewsScraper/${market}`);
                setArticles(googleNewsScrapeResult.data);
            } else {
                const googleNewsScrapeResult = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/googleNewsScraper/${searchTerm}`);
                setArticles(googleNewsScrapeResult.data);
            }
        } catch (error) {
            console.error(error);
        };
    };

    useEffect(() => {
        setArticles("loading");
        googleNewsScrape(props.searchTerm, props.market);
    }, [props.searchTerm]);

    if (articles === "loading") {
        return <div className="articles-loading">
            <h2>Loading potentially useful articles...</h2>
            <ReactLoading type="bars" color="#404d72" height="15%" width="15%" />
        </div>
    } else {
        return (
            <div className="articles">
                <h3>The articles shown below are generated from a web scrape of the market. This can result in a wide variety in terms of their relevance and usefulness.</h3>
                {articles !== "loading" && <div className="articles-grid">
                    {articles.map((article, index) => {
                        if (article.img === "N/A") {
                            article.img = PlaceholderIcon;
                        }
                        return (
                            <a href={article.link} rel="noreferrer" target="_blank" key={index} style={{ "textDecoration": "none"}}>
                                <div className="article-list-item">
                                    <div className="article-list-item-img-container">
                                        <img className="article-list-item-img" src={article.img} alt="" />
                                    </div>
                                    <div className="article-list-item-text-div">
                                        <h3 className="article-list-item-title">{article.title}</h3>
                                        <p className="article-list-item-description">{article.description}</p>
                                        <hr />
                                        <h5 className="article-list-item-publisher">{article.source}</h5>
                                    </div>
                                </div>
                            </a>
                        )
                    })}
                </div>}
            </div>
        )
    }
}

export default ForecastArticlesDisplay;
