import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomeNewsFeed.css';
import ProfilePic from '../../../media/ProfileP.png';
import ReactLoading from 'react-loading';
import * as AiIcons from 'react-icons/ai';
import ImagePlaceholder from '../../../media/sd.png';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { FaInfoCircle } from 'react-icons/fa';
import Modal from '../../../components/Modal';

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
    const [alternateArticleTitle, setAlternateArticleTitle] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    let userMarketsForPost = [];
    
    useEffect(() => {
        if (causeFeedNewsFeedRefreshWithoutAnimation === true) {
            getAllNewsFeedPostsFromDB();
            // getUserMarketsFromDB(props.username);

            // Version without querying server:
            getUserMarketsFromDB(props.userMarkets);
        } else if (causeFeedNewsFeedRefreshWithoutAnimation === false) {
            setNewPostLoading(true);
            // setTimeout(() => {
                getAllNewsFeedPostsFromDB();
                // getUserMarketsFromDB(props.username);
                
                // Version without querying server:
                // console.log("1");
                // console.log(props.userMarkets);
                // console.log("==========");
                getUserMarketsFromDB(props.userMarkets);
                setNewPostLoading(false);
            // }, 500);
        };
        console.log("NewsFeed UE");
    }, [causeNewsFeedRefresh, causeFeedNewsFeedRefreshWithoutAnimation, props.username, props.userMarkets, props.userObj]);
    // }, [props.userObj, props.userMarkets]);

    const getAllNewsFeedPostsFromDB = async () => {
        try {
            const allPosts = await axios.get(`${process.env.REACT_APP_API_CALL_HPNFP}`);
            console.log(allPosts);
            setFeed(allPosts === undefined ? [] : allPosts.data.reverse());
            setFilteredFeed(feed);
        } catch (error) {
            console.error("Error in getAllNewsFeedPostsFromDB");
            console.error(error);
        };
    };
    
    // Querying Server
    // const getUserMarketsFromDB = async (username) => {
    //     try {
    //         const allMarkets = await axios.get(`${process.env.REACT_APP_API_CALL_L}/${username}`);
    //         let filtersArr = [];
    //         let userMarketsArr = [];
    //         for (let i = 0; i < allMarkets.data.length; i++) {
    //             filtersArr.push(allMarkets.data[i].leaderboardName);
    //             userMarketsArr.push(allMarkets.data[i].leaderboardName);
    //         };
    //         setUserMarkets(userMarketsArr);
    //         setFilters(filtersArr);
    //     } catch (error) {
    //         console.error(error);
    //     };
    // };

    // Not-querying server
    const getUserMarketsFromDB = (userMarkets) => {
        try {
            // console.log("DEBUGGING");
            // console.log(userMarkets);
            // const allMarkets = userMarkets;
            setUserMarkets(userMarkets);
            setFilters(userMarkets);
        } catch (error) {
            console.error(error);
        };
    };

    const openPostSubmission = () => {
        if (props.username === "Guest") {
            setShowModal(true);
            setModalContent("You must be logged into your own account to post to the feed.");
            return;
        } else {
            setPost(true);
            setEditingPost(false);
            setNewPostURL("");
            setNewPostDescription("");
        };
    };

    const handlePostURLChange = async (e, changeFromState) => {
        console.log(e.target.value);
        if (e.target.value.length === 0 || e.target.value === "") {
            setPostPreview(false);
            setNewPostURL("");
            return;
        };
        if (changeFromState === false) {
            const postURL = e.target.value;
            setNewPostURL(postURL);
            setPostPreviewLoading(true);
            // const postPreviewObj = await axios.get(`${process.env.API_CALL_HELP}/getPostInfo`, {
            const postPreviewObj = await axios.get(`${process.env.REACT_APP_API_CALL_HELP}/getPostInfo`, {
                params: {
                    URL: postURL
                }
            });
            console.log(postPreviewObj.data.articleTitle);
            if (postPreviewObj.data.error === "Error" || postPreviewObj.data.articleTitle === "") {
                setPostPreviewTitle("There was an error. Please check the link you have pasted is correct.");
                setAlternateArticleTitle("There was an error. Please check the link you have pasted is correct.");
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

    const handleAlternatePostTitleChange = (e) => {
        if (e.target.value !== "") {
            setAlternateArticleTitle(e.target.value);
        } else {
            setAlternateArticleTitle("There was an error. Please check the link you have pasted is correct.")
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
        if (newPostURL === "" || newPostURL.length === 0) {
            setPostMessage("Please enter a valid link.");
            setTimeout(() => {
                setPostMessage("");
            }, 3000);
            return;
        };
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
            // await axios.post(`${process.env.API_CALL_HPNFP}`, {
            await axios.post(`${process.env.REACT_APP_API_CALL_HPNFP}`, {
                articleURL: newPostURL,
                postDescription: newPostDescription,
                author: username,
                likes: [],
                dislikes: [],
                postDate: new Date(),
                markets: userMarketsForPost,
                authorProfilePicture: props.profilePicture || props.userObj.profilePicture,
                // authorProfilePicture: localStorage.getItem("profilePicture"),
                alternateArticleTitle: alternateArticleTitle,
                authorFFPoints: props.userObj.fantasyForecastPoints
            });
            setCauseFeedNewsFeedRefreshWithoutAnimation(false);
            setCauseFeedNewsFeedRefresh(causeNewsFeedRefresh+1);
        } catch (error) {
            console.error(error);
        };
    };

    const updateOnboarding = async (username) => {
        try {
            // const updatedUserDocument = await axios.patch(`${process.env.API_CALL_U}/onboardingTask/${username}`, {
            const updatedUserDocument = await axios.patch(`${process.env.REACT_APP_API_CALL_U}/onboardingTask/${username}`, {
                onboardingTask: "submitAPost",
                ffPointsIfFalse: 200,
                ffPointsIfTrue: 15
            });
            console.log(updatedUserDocument);
            if (updatedUserDocument.data.firstTime === true) {
                props.handleFirstPost(true);
                props.handleFirstPostModalContent("You just earned 200 Fantasy Forecast Points for your first post! Future posts will earn you 15 points per post.")    
            };
            // Try to redo this so that we don't need to do the GET first 
            // const userDocument = await axios.get(`${process.env.REACT_APP_API_CALL_U}/${username}`);
            // if (userDocument.data[0].onboarding.submitAPost === true) {
            //     userDocument.data[0].fantasyForecastPoints = userDocument.data[0].fantasyForecastPoints + 15
            //     await axios.patch(`${process.env.REACT_APP_API_CALL_U}/${username}`, {
            //         fantasyForecastPoints: userDocument.data[0].fantasyForecastPoints
            //     });
            // } else {
            //     userDocument.data[0].onboarding.submitAPost = true;
            //     userDocument.data[0].fantasyForecastPoints = userDocument.data[0].fantasyForecastPoints + 200
            //     await axios.patch(`${process.env.REACT_APP_API_CALL_U}/${username}`, 
            //         { 
            //             onboarding: userDocument.data[0].onboarding,
            //             fantasyForecastPoints: userDocument.data[0].fantasyForecastPoints 
            //         }
            //     );
            //     props.handleFirstPost(true);
            //     props.handleFirstPostModalContent("You just earned 200 Fantasy Forecast Points for your first post! Future posts will earn you 15 per post.")
            // };
        } catch (error) {
            console.error(error);
        };
    };

    const loadEditPost = async (postID, postURL, postDescription, postMarkets, postTitle) => {
        setPost(true);
        setEditingPost(true);
        setEditingPostID(postID);
        setNewPostURL(postURL);
        setNewPostDescription(postDescription);
        setNewPostMarkets(postMarkets);
        setPostPreview(true);
        setAlternateArticleTitle(postTitle);
    };

    const persistEditPostToDB = async (e, postID, postURL, postDescription, postMarkets, altTitle) => {
        e.preventDefault();
        if (userMarketsForPost.length === 0) {
            setPostMessage("You must select at least one market.");
            setTimeout(() => {
                setPostMessage("");
            }, 3000);
            return;
        };
        try {
            // await axios.patch(`${process.env.API_CALL_HPNFP}/${postID}`, {
            await axios.patch(`${process.env.REACT_APP_API_CALL_HPNFP}/${postID}`, {
                articleURL: postURL,
                postDescription: postDescription,
                markets: postMarkets,
                authorProfilePicture: props.profilePicture || props.userObj.profilePicture,
                // authorProfilePicture: localStorage.getItem("profilePicture"),
                articleTitle: postPreviewTitle === "There was an error. Please check the link you have pasted is correct." ? altTitle : postPreviewTitle
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
            // await axios.delete(`${process.env.API_CALL_HPNFP}/${postID}`);
            await axios.delete(`${process.env.REACT_APP_API_CALL_HPNFP}/${postID}/${props.username}`);
            setCauseFeedNewsFeedRefreshWithoutAnimation(false);
            setCauseFeedNewsFeedRefresh(causeNewsFeedRefresh+1);
        } catch (error) {
            console.error(error);
        }
    };

    const voteOnPost = async (vote, postID, postVotes, postAuthor) => {
        try {
            if (vote === "upvote") {
                // await axios.patch(`${process.env.API_CALL_HPNFP}/vote/${postID}`, { vote: "upvote", username: props.username })
                await axios.patch(`${process.env.REACT_APP_API_CALL_HPNFP}/vote/${postID}`, { vote: "upvote", username: props.username })
            } else if (vote === "downvote") {
                // await axios.patch(`${process.env.API_CALL_HPNFP}/vote/${postID}`, { vote: "downvote", username: props.username })
                await axios.patch(`${process.env.REACT_APP_API_CALL_HPNFP}/vote/${postID}`, { vote: "downvote", username: props.username })
            }
            if (props.username !== postAuthor) {
                // await axios.patch(`${process.env.API_CALL_U}/newNotification/${postAuthor}`, {
                await axios.patch(`${process.env.REACT_APP_API_CALL_U}/newNotification/${postAuthor}`, {
                    notificationMessage: `${props.username === undefined ? "Someone" : props.username} just voted on your news feed post!`,
                    notificationSourcePath: "/news-post",
                    notificationSourceObjectID: postID
                });
            };
            setCauseFeedNewsFeedRefreshWithoutAnimation(true);
        } catch (error) {
            console.error(error);
            console.error("error in HomeNewsFeed.js > voteOnPost");
        }
    }

    const filterNewsFeed = (leaderboardName, feed, filters) => {
        let userMarketsBackup = [];
        // Have to make this backup array manually as for some reason on line 312 it also splices userMarkets
        // meaning the filter checkboxes on the News Feed just disappear :/ this loop solution does work though
        for (let i = 0; i < userMarkets.length; i++) {
            userMarketsBackup.push(userMarkets[i]);
        };
        if (filters !== feed) {
            setFiltersApplied(true);
        } else {
            setFiltersApplied(false);
        };
        let filterArray = filters;
        if (filterArray.includes(leaderboardName)) {
// console.log(userMarkets);
            filterArray.splice(filterArray.indexOf(leaderboardName), 1);
// console.log(userMarkets);
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
        setUserMarkets(userMarketsBackup);
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
                <Modal show={showModal} handleClose={() => setShowModal(false)}>
                    <p>{modalContent}</p>
                </Modal>
                <ConfirmationModal 
                    show={showConfirmationModal} 
                    handleClose={() => {
                        deletePost(postIDToDelete); 
                        setShowConfirmationModal(false)
                    }} 
                    justClose={() => setShowConfirmationModal(false)}
                />
                <h1 className="news-feed-title">
                    My Feed
                    <FaInfoCircle 
                        onClick={() => {
                            setShowModal(true);
                            setModalContent(`This is the main feed for Fantasy Forecast where all users can post links to articles, videos and websites they feel might be of use or of interest to others in the same market. Feel free to post whatever you feel other users might want to see here!`)
                        }}
                        style={{ "color": "orange", "cursor": "pointer" }}
                    />
                </h1>
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
                                <input 
                                    type="link" 
                                    className="source-field" 
                                    name="source" 
                                    id="post-1" 
                                    placeholder="Have an article, video, or blog you'd like to share? Paste your link here!" 
                                    size="100"
                                    value={newPostURL}
                                    onChange={(e) => handlePostURLChange(e, false)}/>
                                <br/>
                                {postPreviewTitle === "There was an error. Please check the link you have pasted is correct." && 
                                    <div>
                                        <label htmlFor="post-3"><strong>If the post preview below says there's an error, type in an alternative title for your link here instead:</strong></label>
                                        <br/>
                                        <input 
                                            type="text" 
                                            className="source-field" 
                                            name="source" 
                                            id="post-3" 
                                            placeholder="Alternate Title" 
                                            size="100"
                                            value={alternateArticleTitle}
                                            onChange={(e) => handleAlternatePostTitleChange(e)}/>
                                        <br/>
                                    </div>
                                }
                                <label htmlFor="post-2"><strong>Post:</strong></label>
                                <br/>
                                <textarea 
                                    className="summary-field" 
                                    name="summary" id="post-2" 
                                    placeholder="What's your post about? What's your opinion?" 
                                    rows="2"
                                    maxLength={700}
                                    value={newPostDescription}
                                    onChange={(e) => handlePostSummaryChange(e, false)}>
                                </textarea>
                                <br/>
                                <h4>Markets:</h4>
                                <p>Select all markets that your post is relevant to (only forecasters in the markets you select will be able to see your post. Select Fantasy Forecast All-Time if you feel it's relevant to everyone!)</p>
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
                                <div className="post-buttons">
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
                                            onClick={(e) => persistEditPostToDB(e, editingPostID, newPostURL, newPostDescription, userMarketsForPost, alternateArticleTitle)}/>
                                    }
                                    <button 
                                    className="create-post-close" 
                                    onClick={() => {
                                        setPost(false); 
                                        setPostPreview(false)}}>
                                            Close
                                    </button>
                                </div>
                            </fieldset>
                        </form>
                    }
                    {filteringFeed === true &&
                        <div className="news-feed-filter-div">
                            <div className="checkbox-div">
                                {userMarkets.map((item, index) => {
                                    console.log(item);
                                    console.log(filters.includes(item));
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
                                        {/* <img className="author-profile-pic" src={localStorage.getItem("profilePicture") || ProfilePic} alt=""/> */}
                                        <img className="author-profile-pic" src={props.profilePicture || props.userObj.profilePicture} alt=""/>
                                        <div className="post-author-details">
                                            <h3>{props.username}</h3>
                                            <h5>{new Date().toString().slice(0, 15)}</h5>
                                        </div>
                                    </div>
                                </div>
                                <p className="post-author-description">{newPostDescription}</p>
                                <div className="post-news-preview">
                                    <a href={newPostURL} target="_blank" rel="noreferrer nofollow" className="post-news-a">
                                            {postPreviewImage !== "" && <img src={postPreviewImage} className="post-news-image" alt="News pic"/>}
                                            {postPreviewImage === "" && <img src={ImagePlaceholder} className="post-news-image-placeholder" alt="News pic"/>}
                                    </a>
                                    <a href={newPostURL} className="post-news-title" target="_blank" rel="noreferrer nofollow"><h3>{postPreviewTitle === "There was an error. Please check the link you have pasted is correct." ? alternateArticleTitle : postPreviewTitle}</h3></a>
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
                                            {/* <img className="author-profile-pic" src={item.author === props.username ? localStorage.getItem("profilePicture") : item.authorProfilePicture} alt=""/> */}
                                            <img className="author-profile-pic" src={item.authorProfilePicture} alt="" style={{border: `3px solid ${item.authorBorderColor}`}} />
                                            <div className="post-author-details">
                                                <Link 
                                                    to={item.author === props.username ? {pathname: "/my-profile"} : {pathname: "/search", clickedUsername: item.author}}
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
                                                        onClick={() => { loadEditPost(item._id, item.articleURL, item.postDescription, item.markets, item.articleTitle); window.scrollTo(0, 0);}} />
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
                                                    onClick={() => voteOnPost("upvote", item._id, item.likes, item.author)} />
                                                    {item.likes.length}
                                                <AiIcons.AiFillDislike 
                                                    size={25} 
                                                    className="post-control-btn" 
                                                    color={"darkred"} 
                                                    onClick={() => voteOnPost("downvote", item._id, item.dislikes, item.author)} />
                                                    {item.dislikes.length}
                                            </div>
                                        </div>
                                    </div>
                                    <Link style={{ textDecoration: "none", color: "black" }} to={articleProps} onClick={() => localStorage.setItem("postID", item._id)}>
                                        <p className="post-author-description">{item.postDescription} <i style={{"color":"#404d72"}}><u>See Comments ({item.comments.length})</u></i></p>
                                        <div className="post-news-preview">
                                            <a href={item.articleURL} target="_blank" rel="noreferrer nofollow">
                                                {item.articleImage !== null && <img src={item.articleImage} className="post-news-image" alt="News pic"/>}
                                                {item.articleImage === null && <img src={ImagePlaceholder} className="post-news-image-placeholder" alt="News pic"/>}
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
                                                {/* <img className="author-profile-pic" src={item.author === props.username ? localStorage.getItem("profilePicture") : item.authorProfilePicture} alt=""/> */}
                                                <img className="author-profile-pic" src={item.authorProfilePicture} alt="" style={{border: `3px solid ${item.authorBorderColor}`}}/>
                                                <div className="post-author-details">
                                                    <Link 
                                                        to={item.author === props.username ? {pathname: "/my-profile"} : {pathname: "/search", clickedUsername: item.author}}
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
                                                            onClick={() => { loadEditPost(item._id, item.articleURL, item.postDescription, item.markets, item.articleTitle); window.scrollTo(0, 0);}} />
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
                                                        onClick={() => voteOnPost("upvote", item._id, item.likes, item.author)} />
                                                        {item.likes.length}
                                                    <AiIcons.AiFillDislike 
                                                        size={25} 
                                                        className="post-control-btn" 
                                                        color={"darkred"} 
                                                        onClick={() => voteOnPost("downvote", item._id, item.dislikes, item.author)} />
                                                        {item.dislikes.length}
                                                </div>
                                            </div>
                                        </div>
                                        <Link style={{ textDecoration: "none", color: "black"}} to={articleProps} onClick={() => localStorage.setItem("postID", item._id)}>
                                            <p className="post-author-description">{item.postDescription} <i style={{"color":"#404d72"}}><u>See Comments ({item.comments.length})</u></i></p>
                                            <div className="post-news-preview">
                                                <a href={item.articleURL} target="_blank" rel="noreferrer nofollow">
                                                    {item.articleImage !== null && <img src={item.articleImage} className="post-news-image" alt="News pic"/>}
                                                    {item.articleImage === null && <img src={ImagePlaceholder} className="post-news-image-placeholder" alt="News pic"/>}
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
