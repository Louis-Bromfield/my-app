import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ForecastArticlesDisplay.css';
import PlaceholderIcon from '../../../media/sd.png';
import ReactLoading from 'react-loading';

function ForecastArticlesDisplay(props) {
    const [articles, setArticles] = useState("loading");

    const googleNewsScrape = async (searchTerm) => {
        try {
            const googleNewsScrapeResult = await axios.get(`http://localhost:5000/googleNewsScraper/${searchTerm}`);
            setArticles(googleNewsScrapeResult.data);
        } catch (error) {
            console.error(error);
        };
    };

    useEffect(() => {
        setArticles("loading");
        googleNewsScrape(props.searchTerm);
    }, [props.searchTerm]);

    if (articles === "loading") {
        return <div className="articles-loading">
            <h2>Loading potentially useful articles...</h2>
            <ReactLoading type="bars" color="#404d72" height="15%" width="15%" />
        </div>
    } else {
        return (
            <div className="articles">
                <h3>Here are some articles that might be of use to you when thinking about a prediction. Feel free to use/ignore them!</h3>
                {articles !== "loading" && <div className="articles-grid">
                    {articles.map((article, index) => {
                        if (article.img === "N/A") {
                            article.img = PlaceholderIcon;
                        }
                        return (
                            <a href={article.link} rel="noreferrer" target="_blank" key={index} style={{ "textDecoration": "none"}}>
                                <li className="article-list-item">
                                    <div className="article-list-item-img-container">
                                        <img className="article-list-item-img" src={article.img} alt="" />
                                    </div>
                                    <div className="article-list-item-text-div">
                                        <h3 className="article-list-item-title">{article.title}</h3>
                                        <p className="article-list-item-description">{article.description}</p>
                                        <hr />
                                        <h5 className="article-list-item-publisher">{article.source}</h5>
                                    </div>
                                </li>
                            </a>
                        )
                    })}
                </div>}
            </div>
        )
    }
}

export default ForecastArticlesDisplay;
