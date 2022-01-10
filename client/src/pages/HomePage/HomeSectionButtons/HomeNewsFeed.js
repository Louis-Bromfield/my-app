import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomeNewsFeed.css';
import ProfilePic from '../../../media/ProfileP.png';
import ReactLoading from 'react-loading';
import * as AiIcons from 'react-icons/ai';
import ImagePlaceholder from '../../../media/sd.png';
import ConfirmationModal from '../../../components/ConfirmationModal';

function HomeNewsFeed(props) {
    const [feed, setFeed] = useState([]);
    const [post, setPost] = useState(false);
    const [newPostLoading, setNewPostLoading] = useState(false);
    const [causeNewsFeedRefresh, setCauseFeedNewsFeedRefresh] = useState(0);
    const [causeFeedNewsFeedRefreshWithoutAnimation, setCauseFeedNewsFeedRefreshWithoutAnimation] = useState(false);
    const [newPostURL, setNewPostURL] = useState("");
    const [newPostDescription, setNewPostDescription] = useState("");
    const [newPostMarkets, setNewPostMarkets] = useState([]);
    const [editingPost, setEditingPost] = useState(false);
    const [editingPostID, setEditingPostID] = useState();
    const [userMarkets, setUserMarkets] = useState([]);
    const [postMessage, setPostMessage] = useState("");
    const [filters, setFilters] = useState([]);
    const [filteredFeed, setFilteredFeed] = useState([]);
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [postPreview, setPostPreview] = useState(false);
    const [postPreviewTitle, setPostPreviewTitle] = useState();
    const [postPreviewImage, setPostPreviewImage] = useState();
    const [postPreviewLoading, setPostPreviewLoading] = useState(false);
    const [filteringFeed, setFilteringFeed] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [postIDToDelete, setPostIDToDelete] = useState();
    let userMarketsForPost = [];
    
    useEffect(() => {
        if (causeFeedNewsFeedRefreshWithoutAnimation === true) {
            getAllNewsFeedPostsFromDB();
            getUserMarketsFromDB(props.username);
        } else if (causeFeedNewsFeedRefreshWithoutAnimation === false) {
            setNewPostLoading(true);
            setTimeout(() => {
                getAllNewsFeedPostsFromDB();
                getUserMarketsFromDB(props.username);
                setNewPostLoading(false);
            }, 1000);
        };
        // setCauseFeedNewsFeedRefreshWithoutAnimation(false);
    }, [causeNewsFeedRefresh, causeFeedNewsFeedRefreshWithoutAnimation, props.username]);

    const getAllNewsFeedPostsFromDB = async () => {
        try {
            const allPosts = await axios.get('https://fantasy-forecast-politics.herokuapp.com/homePageNewsFeedPosts');
            setFeed(allPosts.data.reverse());
            setFilteredFeed(feed);
        } catch (error) {
            console.error(error);
        };
    };

    const getUserMarketsFromDB = async (username) => {
        try {
            const allMarkets = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/leaderboards/${username}`);
            let filtersArr = [];
            let userMarketsArr = [];
            for (let i = 0; i < allMarkets.data.length; i++) {
                // if (allMarkets.data[i].leaderboardName !== 'Fantasy Forecast All-Time') {
                    filtersArr.push(allMarkets.data[i].leaderboardName);
                    userMarketsArr.push(allMarkets.data[i].leaderboardName);
                // };
            };
            setUserMarkets(userMarketsArr);
            setFilters(filtersArr);
        } catch (error) {
            console.error(error);
        };
    };

    const openPostSubmission = () => {
        setPost(true);
        setEditingPost(false);
        setNewPostURL("");
        setNewPostDescription("");
    }

    const handlePostURLChange = async (e, changeFromState) => {
        if (e.target.value.length === 0 || e.target.value === "") {
            setPostPreview(false);
            setNewPostURL("");
            return;
        };
        if (changeFromState === false) {
            const postURL = e.target.value;
            setNewPostURL(postURL);
            setPostPreviewLoading(true);
            const postPreviewObj = await axios.get('https://fantasy-forecast-politics.herokuapp.com/helpers/getPostInfo', {
                params: {
                    URL: postURL
                }
            });
            if (postPreviewObj.data.error === "Error") {
                setPostPreviewTitle("There was an error. Please check the link you have pasted is correct.");
                setPostPreviewImage("");
            } else {
                setPostPreviewTitle(postPreviewObj.data.articleTitle);
                setPostPreviewImage(postPreviewObj.data.articleImage);
            };
            setTimeout(() => {
                setPostPreviewLoading(false);
                setPostPreview(true);
            }, 500);
        };
    };

    const handlePostSummaryChange = (e, changeFromState) => {
        if (changeFromState === false) {
            const postSummary = e.target.value;
            setNewPostDescription(postSummary);
        };
    };

    const editMarketList = (market) => {
        if (!userMarketsForPost.includes(market)) {
            userMarketsForPost.push(market);
        } else if (userMarketsForPost.includes(market)) {
            userMarketsForPost.splice(userMarketsForPost.indexOf(market), 1);
        };
    };

    const submitNewsFeedPost = (e) => {
        e.preventDefault();
        if (userMarketsForPost.length === 0) {
            setPostMessage("You must select at least one market.");
            setTimeout(() => {
                setPostMessage("");
            }, 3000);
            return;
        };
        persistPostToDB(props.username);
        setNewPostURL("");
        setNewPostDescription("");
        setPost(false);
        setPostPreview(false);
        updateOnboarding(props.username);
    };

    const persistPostToDB = async (username) => {
        try {
            await axios.post('https://fantasy-forecast-politics.herokuapp.com/homePageNewsFeedPosts', {
                articleURL: newPostURL,
                postDescription: newPostDescription,
                author: username,
                likes: [],
                dislikes: [],
                postDate: new Date(),
                markets: userMarketsForPost,
                authorProfilePicture: localStorage.getItem("profilePicture")
            });
            setCauseFeedNewsFeedRefreshWithoutAnimation(false);
            setCauseFeedNewsFeedRefresh(causeNewsFeedRefresh+1);
        } catch (error) {
            console.error(error);
        };
    };

    const updateOnboarding = async (username) => {
        try {
            // Try to redo this so that we don't need to do the GET first 
            const userDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`);
            if (userDocument.data[0].onboarding.submitAPost === true) {
                userDocument.data[0].fantasyForecastPoints = userDocument.data[0].fantasyForecastPoints + 25
                await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`, {
                    fantasyForecastPoints: userDocument.data[0].fantasyForecastPoints
                });
            } else {
                userDocument.data[0].onboarding.submitAPost = true;
                userDocument.data[0].fantasyForecastPoints = userDocument.data[0].fantasyForecastPoints + 200
                await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`, 
                    { 
                        onboarding: userDocument.data[0].onboarding,
                        fantasyForecastPoints: userDocument.data[0].fantasyForecastPoints 
                    }
                );
                props.handleFirstPost(true);
                props.handleFirstPostModalContent("You just earned 200 Fantasy Forecast Points for your first post! Future posts will earn you 25 per post.")
            };
        } catch (error) {
            console.error(error);
        };
    };

    const loadEditPost = async (postID, postURL, postDescription, postMarkets) => {
        setPost(true);
        setEditingPost(true);
        setEditingPostID(postID);
        setNewPostURL(postURL);
        setNewPostDescription(postDescription);
        setNewPostMarkets(postMarkets);
        setPostPreview(true);
    };

    const persistEditPostToDB = async (e, postID, postURL, postDescription, postMarkets) => {
        e.preventDefault();
        if (userMarketsForPost.length === 0) {
            setPostMessage("You must select at least one market.");
            setTimeout(() => {
                setPostMessage("");
            }, 3000);
            return;
        };
        try {
            await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/homePageNewsFeedPosts/${postID}`, {
                articleURL: postURL,
                postDescription: postDescription,
                markets: postMarkets,
                authorProfilePicture: localStorage.getItem("profilePicture") 
            });
            setCauseFeedNewsFeedRefreshWithoutAnimation(false);
            setCauseFeedNewsFeedRefresh(causeNewsFeedRefresh+1);
            setNewPostURL("");
            setNewPostDescription("");
            setPost(false);
            setPostPreview(false);
        } catch (error) {
            console.error(error);
        };
    };

    const deletePost = async (postID) => {
        try {
            await axios.delete(`https://fantasy-forecast-politics.herokuapp.com/homePageNewsFeedPosts/${postID}`);
            setCauseFeedNewsFeedRefreshWithoutAnimation(false);
            setCauseFeedNewsFeedRefresh(causeNewsFeedRefresh+1);
        } catch (error) {
            console.error(error);
        }
    };

    const voteOnPost = async (vote, postID, postVotes) => {
        try {
            if (vote === "upvote") {
                await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/homePageNewsFeedPosts/vote/${postID}`, { vote: "upvote", username: props.username })
            } else if (vote === "downvote") {
                await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/homePageNewsFeedPosts/vote/${postID}`, { vote: "downvote", username: props.username })
            }
            setCauseFeedNewsFeedRefreshWithoutAnimation(true);
        } catch (error) {
            console.error(error);
            console.error("error in HomeNewsFeed.js > voteOnPost");
        }
    }

    const filterNewsFeed = (leaderboardName, feed, filters) => {
        if (filters !== feed) {
            setFiltersApplied(true);
        } else {
            setFiltersApplied(false);
        };
        let filterArray = filters;
        if (filterArray.includes(leaderboardName)) {
            filterArray.splice(filterArray.indexOf(leaderboardName), 1);
        } else if (!filterArray.includes(leaderboardName)) {
            filterArray.push(leaderboardName);
        };
        let filteredFeedArr = [];
        for (let i = 0; i < feed.length; i++) {
            if (filterArray.some(el => feed[i].markets.includes(el)) === true) {
                filteredFeedArr.push(feed[i]);
            };
        };
        setFilteredFeed(filteredFeedArr);
    };

    const checkCheckBoxes = (market, markets) => {
        if (markets.includes(market)) {
            userMarketsForPost.push(market);
            return true;
        } else {
            return false; 
        };
    };

    return (
            <div className="home-page-news-feed-container">
                <ConfirmationModal 
                    show={showConfirmationModal} 
                    handleClose={() => {
                        deletePost(postIDToDelete); 
                        setShowConfirmationModal(false)
                    }} 
                    justClose={() => setShowConfirmationModal(false)}
                />
                <h1 className="news-feed-title">News Feed</h1>
                <div className="post">
                    {post === false && 
                        <div className="feed-top-buttons">
                            <button 
                                className="create-post-button" 
                                onClick={openPostSubmission}>
                                    Post to your feed
                            </button>
                            {filteringFeed === false ?
                                <button 
                                    className="create-post-button" 
                                    onClick={() => setFilteringFeed(true)}>
                                        Filter your feed
                                </button>
                                :
                                <button 
                                    className="create-post-button" 
                                    onClick={() => setFilteringFeed(false)}>
                                        Close Filters
                                </button>
                            }
                        </div>
                    }
                    {post === true && 
                        <form className="create-post-form">
                            <fieldset className="create-post-fieldset">
                                {/* <legend></legend> */}
                                <label htmlFor="post-1"><strong>Link:</strong></label>
                                <br/>
                                {/* Add error checking to ensure a link is posted? */}
                                <input 
                                    type="link" 
                                    className="source-field" 
                                    name="source" 
                                    id="post-1" 
                                    placeholder="Paste your link here" 
                                    size="100"
                                    value={newPostURL}
                                    onChange={(e) => handlePostURLChange(e, false)}/>
                                <br/>
                                <label htmlFor="post-2"><strong>Post Summary:</strong></label>
                                <br/>
                                <textarea 
                                    className="summary-field" 
                                    name="summary" id="post-2" 
                                    placeholder="What's your post about? What's your opinion?" 
                                    rows="2"
                                    value={newPostDescription}
                                    onChange={(e) => handlePostSummaryChange(e, false)}>
                                </textarea>
                                <br/>
                                <h4>Select all markets that your post is relevant to (Only players in the markets you select will be able to see your post):</h4>
                                <h4>(Select Fantasy Forecast All-Time if you feel this story is relevant to everyone!)</h4>
                                <hr />
                                {editingPost === false &&
                                    <div className="post-checkboxes">
                                        {userMarkets.map((market, index) => {
                                            return (
                                                <div key={index} className="market-checkbox">
                                                    <input 
                                                        type="checkbox" 
                                                        className="market-cb" 
                                                        onClick={() => editMarketList(market)}
                                                    />
                                                    <h4>{market}</h4>
                                                    <hr />
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                                {editingPost === true &&
                                    <div className="post-checkboxes">
                                        {userMarkets.map((market, index) => {
                                            return (
                                                <div key={index} className="market-checkbox">
                                                    <input 
                                                        type="checkbox" 
                                                        className="market-cb" 
                                                        defaultChecked={checkCheckBoxes(market, newPostMarkets)} 
                                                        onClick={() => editMarketList(market)} 
                                                    />
                                                    <h4>{market}</h4>
                                                    <hr />
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                                {postMessage !== "" && <h3 style={{ color: "red" }}>{postMessage}</h3>}
                                {editingPost === false &&
                                    <input 
                                        type="submit" 
                                        id="post-2" 
                                        className="create-post-submit" 
                                        value="Post to your feed" 
                                        onClick={(e) => submitNewsFeedPost(e)}/>
                                }
                                {editingPost === true &&
                                    <input 
                                        type="submit" 
                                        id="post-2" 
                                        className="create-post-submit" 
                                        value="Confirm Edits" 
                                        onClick={(e) => persistEditPostToDB(e, editingPostID, newPostURL, newPostDescription, userMarketsForPost)}/>
                                }
                                <button className="create-post-close" onClick={() => {setPost(false); setPostPreview(false)}}>Close</button>
                            </fieldset>
                        </form>
                    }
                    {filteringFeed === true &&
                        <div className="news-feed-filter-div">
                            <div className="checkbox-div">
                                {userMarkets.map((item, index) => {
                                    if (filters.includes(item)) {
                                        return (
                                            <div className="filter-market-checkbox" key={index} >
                                                <label htmlFor={item}><h3>{item}</h3></label>
                                                <input 
                                                    type="checkbox" 
                                                    name={item} 
                                                    id={item} 
                                                    defaultChecked={true}
                                                    onClick={() => filterNewsFeed(item, feed, filters)}
                                                />
                                            </div>
                                        )
                                    } else if (!filters.includes(item)) {
                                        return (
                                            <div className="filter-market-checkbox" key={index} >
                                                <label htmlFor={item}><h3>{item}</h3></label>
                                                <input 
                                                    type="checkbox" 
                                                    name={item} 
                                                    id={item} 
                                                    defaultChecked={false}
                                                    onClick={() => filterNewsFeed(item, feed, filters)}
                                                />
                                            </div>
                                        )
                                    } else return null;
                                })}
                            </div>
                        </div>
                    }
                    {postPreviewLoading === true && <div className="loading-div"><ReactLoading type="bars" color="#404d72" height="20%" width="20%"/></div>}
                    {postPreviewLoading === false && postPreview === true && 
                        <div className="post-preview-container">
                            <h3 style={{ color: "#404d72" }}>Post Preview:</h3>
                            <div className="news-feed-post">
                                <div className="post-author">
                                    <div className="post-author-left">
                                        <img className="author-profile-pic" src={localStorage.getItem("profilePicture") || ProfilePic} alt=""/>
                                        <div className="post-author-details">
                                            <h3>{props.username}</h3>
                                            <h5>{new Date().toString().slice(0, 15)}</h5>
                                        </div>
                                    </div>
                                </div>
                                <p className="post-author-description">{newPostDescription}</p>
                                <div className="post-news-preview">
                                    <a href={newPostURL} target="_blank" rel="noreferrer nofollow">
                                            {postPreviewImage !== "" && <img src={postPreviewImage} className="post-news-image" alt="News pic"/>}
                                            {postPreviewImage === "" && <img src={ImagePlaceholder} className="post-news-image-placeholder" alt="News pic"/>}
                                    </a>
                                    <a href={newPostURL} className="post-news-title" target="_blank" rel="noreferrer nofollow"><h3>{postPreviewTitle}</h3></a>
                                </div>
                                <div className="post-markets">
                                    {userMarketsForPost.map((market, index) => {
                                        return (
                                            <h4 key={index}>&nbsp;{market}&nbsp;|</h4>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    }
                </div>
                {/* <div className="news-feed-filter-div">
                    <h3>Filter Your Feed:</h3>
                    <div className="checkbox-div">
                        {userMarkets.map((item, index) => {
                            return (
                                <div className="filter-market-checkbox" key={index} >
                                    <label htmlFor={item}><h4>{item}</h4></label>
                                    <input 
                                        type="checkbox" 
                                        name={item} 
                                        id={item} 
                                        defaultChecked={true}
                                        onClick={() => filterNewsFeed(item, feed, filters)}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div> */}
                {newPostLoading === true && <div className="loading-div"><ReactLoading type="bars" color="#404d72" height="20%" width="20%"/></div>}
                {filtersApplied === true &&
                    <ul className="home-page-rss-feed">
                        {filteredFeed.map((item, index) => {
                            const articleProps = {
                                pathname: "/news-post",
                                postObject: item
                            }
                            return (
                                <li key={index} className="news-feed-post">
                                    <div className="post-author">
                                        <div className="post-author-left">
                                            <img className="author-profile-pic" src={item.author === props.username ? localStorage.getItem("profilePicture") : item.authorProfilePicture} alt=""/>
                                            <div className="post-author-details">
                                                <Link 
                                                    to={{pathname: "/search", clickedUsername: item.author}}
                                                    onClick={() => localStorage.setItem("selectedPage", "Search")}
                                                    style={{ textDecoration: "none", color: "#404d72"}}>
                                                        <h3>{item.author}</h3>
                                                </Link>
                                                <h5>{new Date(item.postDate).toString().slice(0, 21)}</h5>
                                            </div>
                                        </div>
                                        <div className="post-author-right">
                                            <div className="post-votes">
                                                {item.author === props.username && 
                                                    <AiIcons.AiFillEdit 
                                                        size={25} 
                                                        className="post-control-btn" 
                                                        onClick={() => { loadEditPost(item._id, item.articleURL, item.postDescription, item.markets); window.scrollTo(0, 0);}} />
                                                }
                                                {item.author === props.username && 
                                                    <AiIcons.AiFillDelete size={25} 
                                                        className="post-control-btn" 
                                                        onClick={() => { setShowConfirmationModal(true); setPostIDToDelete(item._id)}} />
                                                }
                                                <AiIcons.AiFillLike 
                                                    size={25} 
                                                    className="post-control-btn" 
                                                    color={"green"} 
                                                    onClick={() => voteOnPost("upvote", item._id, item.likes)} />
                                                    {item.likes.length}
                                                <AiIcons.AiFillDislike 
                                                    size={25} 
                                                    className="post-control-btn" 
                                                    color={"darkred"} 
                                                    onClick={() => voteOnPost("downvote", item._id, item.dislikes)} />
                                                    {item.dislikes.length}
                                            </div>
                                        </div>
                                    </div>
                                    <Link style={{ textDecoration: "none", color: "black" }} to={articleProps} onClick={() => localStorage.setItem("postID", item._id)}>
                                        <p className="post-author-description">{item.postDescription}</p>
                                        <div className="post-news-preview">
                                            <a href={item.articleURL} target="_blank" rel="noreferrer nofollow">
                                                {item.articleImage !== "" && <img src={item.articleImage} className="post-news-image" alt="News pic"/>}
                                                {item.articleImage === "" && <img src={ImagePlaceholder} className="post-news-image-placeholder" alt="News pic"/>}
                                            </a>
                                            <a href={item.articleURL} className="post-news-title" target="_blank" rel="noreferrer nofollow"><h3>{item.articleTitle}</h3></a>
                                        </div>
                                        <div className="post-markets">
                                            {item.markets.map((market, index) => {
                                                if (index < item.markets.length-1) {
                                                    return (
                                                        <h4 key={index}>&nbsp;{market}&nbsp;|</h4>
                                                    )
                                                }
                                                else return (
                                                    <h4 key={index}>&nbsp;{market}&nbsp;</h4>
                                                )
                                            })}
                                        </div>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                }
                {filtersApplied === false &&
                    <ul className="home-page-rss-feed">
                        {feed.map((item, index) => {
                            const articleProps = {
                                pathname: "/news-post",
                                postObject: item
                            };
                            // check if any element from post.markets is in userMarkets
                            if (item.markets.some(market => userMarkets.includes(market))) {
                                return (
                                    <li key={index} className="news-feed-post">
                                        <div className="post-author">
                                            <div className="post-author-left">
                                                <img className="author-profile-pic" src={item.author === props.username ? localStorage.getItem("profilePicture") : item.authorProfilePicture} alt=""/>
                                                <div className="post-author-details">
                                                    <Link 
                                                        to={{pathname: "/search", clickedUsername: item.author}}
                                                        onClick={() => localStorage.setItem("selectedPage", "Search")}
                                                        style={{ textDecoration: "none", color: "#404d72"}}>
                                                            <h3>{item.author}</h3>
                                                    </Link>
                                                    <h5>{new Date(item.postDate).toString().slice(0, 21)}</h5>
                                                </div>
                                            </div>
                                            <div className="post-author-right">
                                                <div className="post-votes">
                                                    {item.author === props.username && 
                                                        <AiIcons.AiFillEdit 
                                                            size={25} 
                                                            className="post-control-btn" 
                                                            onClick={() => { loadEditPost(item._id, item.articleURL, item.postDescription, item.markets); window.scrollTo(0, 0);}} />
                                                    }
                                                    {item.author === props.username && 
                                                        <AiIcons.AiFillDelete size={25} 
                                                            className="post-control-btn" 
                                                            onClick={() => { setShowConfirmationModal(true); setPostIDToDelete(item._id)}} />
                                                    }
                                                    <AiIcons.AiFillLike 
                                                        size={25} 
                                                        className="post-control-btn" 
                                                        color={"green"} 
                                                        onClick={() => voteOnPost("upvote", item._id, item.likes)} />
                                                        {item.likes.length}
                                                    <AiIcons.AiFillDislike 
                                                        size={25} 
                                                        className="post-control-btn" 
                                                        color={"darkred"} 
                                                        onClick={() => voteOnPost("downvote", item._id, item.dislikes)} />
                                                        {item.dislikes.length}
                                                </div>
                                            </div>
                                        </div>
                                        <Link style={{ textDecoration: "none", color: "black"}} to={articleProps} onClick={() => localStorage.setItem("postID", item._id)}>
                                            <p className="post-author-description">{item.postDescription}</p>
                                            <div className="post-news-preview">
                                                <a href={item.articleURL} target="_blank" rel="noreferrer nofollow">
                                                    {item.articleImage !== "" && <img src={item.articleImage} className="post-news-image" alt="News pic"/>}
                                                    {item.articleImage === "" && <img src={ImagePlaceholder} className="post-news-image-placeholder" alt="News pic"/>}
                                                </a>
                                                <a href={item.articleURL} className="post-news-title" target="_blank" rel="noreferrer nofollow"><h3>{item.articleTitle}</h3></a>
                                            </div>
                                            <div className="post-markets">
                                                {item.markets.map((market, index) => {
                                                    if (index < item.markets.length-1) {
                                                        return (
                                                            <h4 key={index}>&nbsp;{market}&nbsp;|</h4>
                                                        )
                                                    }
                                                    else return (
                                                        <h4 key={index}>&nbsp;{market}&nbsp;</h4>
                                                    )
                                                })}
                                            </div>
                                        </Link>
                                    </li>
                                ) 
                            } else return null;
                        })}
                    </ul>
                }
            </div>
    )
}

export default HomeNewsFeed;
