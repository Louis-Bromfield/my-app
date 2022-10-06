import React, { useState, useEffect } from 'react';
import './IndividualNewsFeedPost.css';
import * as AiIcons from 'react-icons/ai';
import ImagePlaceholder from '../../../media/sd.png';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Modal from '../../../components/Modal';

function IndividualNewsFeedPost(props) {
    const [comment, setComment] = useState("");
    const [newCommentToRender, setNewCommentToRender] = useState("");
    const [newCommentStatus, setNewCommentStatus] = useState(0);
    const [author, setAuthor] = useState("");
    const [authorProfilePicture, setAuthorProfilePicture] = useState("");
    const [postDescription, setPostDescription] = useState("");
    const [postDate, setPostDate] = useState("");
    const [likes, setLikes] = useState([]);
    const [dislikes, setDislikes] = useState([]);
    const [articleImage, setArticleImage] = useState("");
    const [articleTitle, setArticleTitle] = useState("");
    const [articleURL, setArticleURL] = useState("");
    const [markets, setMarkets] = useState([]);
    const [comments, setComments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [modalContent2, setModalContent2] = useState("");
    const [submittedRatings, setSubmittedRatings] = useState(false);
    const [submittedTruthfulRating, setSubmittedTruthfulRating] = useState(false);
    const [submittedRelevantRating, setSubmittedRelevantRating] = useState(false);
    const [truthfulRatingCount, setTruthfulRatingCount] = useState(0);
    const [relevantRatingCount, setRelevantRatingCount] = useState(0);
    const [postID, setPostID] = useState();
    const [truthful, setTruthful] = useState(false);
    const [relevant, setRelevant] = useState(false);

    const history = useHistory();
    const [cookie, setCookie] = useCookies(['username']);

    useEffect(() => {
        console.log(props);
        doEffect();
        console.log("IndividualNewsFeedPost UE");
    }, [props.location.postObject]);

    const doEffect = async () => {
        // if page is refreshed
        if (props.location.postObject === undefined) {
            const res = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/homePageNewsFeedPosts/${localStorage.getItem("postID")}`);
            console.log(res.message);
            // if the postID in LS has been tampered with, just return to home
            if (res.data.message !== undefined) {
                history.push("/home");
                return;
            };
            setAuthor(res.data.author);
            setAuthorProfilePicture(res.data.authorProfilePicture);
            setPostDescription(res.data.postDescription);
            setPostDate(res.data.postDate);
            setLikes(res.data.likes);
            setDislikes(res.data.dislikes);
            setArticleImage(res.data.articleImage);
            setArticleTitle(res.data.articleTitle);
            setArticleURL(res.data.articleURL);
            setMarkets(res.data.markets);
            setComments(res.data.comments.reverse());
            setPostID(res.data._id);
            let truthfulCount = 0;
            let relevantCount = 0;
            for (let i = 0; i < res.data.ratings.length; i++) {
                if (res.data.ratings[i].truthful === true) {
                    truthfulCount++;
                };
                if (res.data.ratings[i].relevant === true) {
                    relevantCount++;
                };
                if (res.data.ratings[i].username === cookie.username) {
                    setSubmittedRatings(true);
                };
            };
            setTruthfulRatingCount(truthfulCount);
            setRelevantRatingCount(relevantCount);
        } else {
            setAuthor(props.location.postObject.author);
            setAuthorProfilePicture(props.location.postObject.authorProfilePicture);
            console.log(props.location.postObject.authorProfilePicture);
            setPostDescription(props.location.postObject.postDescription);
            setPostDate(props.location.postObject.postDate);
            setLikes(props.location.postObject.likes);
            setDislikes(props.location.postObject.dislikes);
            setArticleImage(props.location.postObject.articleImage);
            setArticleTitle(props.location.postObject.articleTitle);
            setArticleURL(props.location.postObject.articleURL);
            setMarkets(props.location.postObject.markets);
            setComments(props.location.postObject.comments.reverse());
            setPostID(props.location.postObject._id);
            let truthfulCount = 0;
            let relevantCount = 0;
            for (let i = 0; i < props.location.postObject.ratings.length; i++) {
                if (props.location.postObject.ratings[i].truthful === true) {
                    truthfulCount++;
                };
                if (props.location.postObject.ratings[i].relevant === true) {
                    relevantCount++;
                };
                if (props.location.postObject.ratings[i].username === cookie.username) {
                    setSubmittedRatings(true);
                };
            };
            setTruthfulRatingCount(truthfulCount);
            setRelevantRatingCount(relevantCount);
        };
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
        setNewCommentStatus(false);
    };

    const submitNewComment = async (comment) => {
        const ID = props.location.postObject === undefined ? localStorage.getItem("postID") : props.location.postObject._id;
        try {
            await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/homePageNewsFeedPosts/postComment/${ID}`, 
            {
                postID: ID,
                isNewComment: true,
                newComment: comment,
                // CHARMANDER Would like to change this as otherwise you could make posts in someone else's name
                // author: localStorage.getItem("username")
                author: cookie.username
            });
            setNewCommentStatus(true);
            setNewCommentToRender(comment)
            setComment("");
            // CHARMANDER
            // giveUserPoints(localStorage.getItem("username"));
            giveUserPoints(cookie.username);
            // if (cookie.username !== undefined && author !== cookie.username) {
                await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/newNotification/${author}`, {
                    notificationMessage: `${cookie.username === undefined ? "Someone" : cookie.username} just commented on your news feed post!`,
                    notificationSourcePath: "/news-post",
                    notificationSourceObjectID: ID
                });
            // }
        } catch (error) {
            console.error("Error in IndividualNewsFeedPost > submitComment");
            console.error(error);
        };
    };

    const giveUserPoints = async (username) => {
        try {
            const userDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`);
            let userPrePoints = userDocument.data[0].fantasyForecastPoints;

            let trophyUpdate = false;
            let trophyText = "";
            if ((userPrePoints < 1500) && (userDocument.data[0].fantasyForecastPoints+10 >= 1500)) {
                trophyUpdate = true;
                trophyText = "Seer"
            } else if ((userPrePoints < 2000) && (userDocument.data[0].fantasyForecastPoints+10 >= 2000)) {
                trophyUpdate = true;
                trophyText = "Soothsayer"
            } else if ((userPrePoints < 2500) && (userDocument.data[0].fantasyForecastPoints+10 >= 2500)) {
                trophyUpdate = true;
                trophyText = "Oracle"
            } else if ((userPrePoints < 5000) && (userDocument.data[0].fantasyForecastPoints+10 >= 5000)) {
                trophyUpdate = true;
                trophyText = "Diviner"
            };
            if (trophyUpdate === true) {
                for (let i = 0; i < userDocument.data[0].trophies.length; i++) {
                    if (userDocument.data[0].trophies[i].trophyText === trophyText && userDocument.data[0].trophies[i].obtained === false) {
                        userDocument.data[0].trophies[i].obtained = true;
                        setModalContent2(`And you just reached the ${trophyText} rank, unlocking a new trophy for your profile!`);
                    };
                };
            };
            userDocument.data[0].fantasyForecastPoints = userDocument.data[0].fantasyForecastPoints + 10
            await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`, {
                fantasyForecastPoints: userDocument.data[0].fantasyForecastPoints,
                trophies: userDocument.data[0].trophies
            });
            setModalContent("You just earned 10 Fantasy Forecast Points for commenting!");
            setShowModal(true);
            // setTimeout(() => {
            //     setShowModal("false");
            //     setModalContent("");
            //     setModalContent2("");
            // }, 2500);
        } catch (error) {
            console.error(error);
        };
    };

    const submitRatingOnPost = async () => {
        try {
            if (cookie.username === "Guest") {
                setShowModal(true);
                setModalContent("You must be logged into your own account to rate posts.");
                return;
            } else if (cookie.username === author) {
                setShowModal(true);
                setModalContent("You cannot rate your own post.");
            } else if (submittedTruthfulRating === true && submittedRelevantRating === true) {
                // add in axios here to edit post document
                const res = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/homePageNewsFeedPosts/postRatings/${postID}`, {
                    username: cookie.username,
                    truthful: truthful,
                    relevant: relevant
                });
                if (res.statusCode === -1 && res.status === "Error in user rank") {
                    setShowModal(true);
                    setModalContent("You must be at least Level 20 to submit Truthful / Relevance ratings.");
                };
                if (truthful === true) {
                    setTruthfulRatingCount(truthfulRatingCount + 1);
                }
                if (relevant === true) {
                    setRelevantRatingCount(relevantRatingCount + 1);
                };
                // send user a notification for when they receive a rating
                await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/newNotification/${author}`, {
                    notificationMessage: `${cookie.username === undefined ? "Someone" : cookie.username} just rated your news feed post! If this was the first rating you received, you have been awarded the Gather Round trophy!`,
                    notificationSourcePath: "/news-post",
                    notificationSourceObjectID: postID,
                    notificationRating: true,
                    truthful: truthful,
                    relevant: relevant
                });
                setSubmittedRatings(true);
            };
        } catch (err) {
            console.error("Error in IndividualNewsFeedPost > submitRatingOnPost");
            console.error(err);
        };
    };

    return (
        <div className="individual-post-container">
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
                <p>{modalContent2}</p>
            </Modal>
            <button 
                className="post-button"
                onClick={() => history.push("/home")}>
                    Return to Home
            </button>
            <div className="post-container">
                <div key={1} className="individual-news-feed-post">
                    <div className="post-author">
                        <div className="post-author-left">
                            {/* CHARMANDER */}
                            {/* <img className="author-profile-pic" src={author === localStorage.getItem("username") ? localStorage.getItem("profilePicture") : authorProfilePicture} alt=""/> */}
                            <img className="author-profile-pic" src={authorProfilePicture === undefined ? "" : authorProfilePicture} alt=""/>
                            <div className="post-author-details">
                                <Link 
                                    to={author === cookie.username ? {pathname: "/my-profile"} : {pathname: "/search", clickedUsername: author}}
                                    onClick={() => localStorage.setItem("selectedPage", "Search")}
                                    style={{ textDecoration: "none", color: "#404d72"}}>
                                        <h3>{author}</h3>
                                </Link>
                                <h5>{new Date(postDate).toString().slice(0, 21)}</h5>
                            </div>
                        </div>
                        {/* <div className="post-author-right"> */}
                            {/* <div className="post-votes"> */}
                                {/* <AiIcons.AiFillLike  */}
                                    {/* size={25}  */}
                                    {/* className="post-control-btn"  */}
                                    {/* color={"green"} /> */}
                                    {/* onClick={() => voteOnPost("upvote", _id, likes)} /> */}
                                    {/* {likes.length} */}
                                {/* <AiIcons.AiFillDislike  */}
                                    {/* size={25}  */}
                                    {/* className="post-control-btn"  */}
                                    {/* color={"darkred"} /> */}
                                    {/* onClick={() => voteOnPost("downvote", _id, dislikes)} /> */}
                                    {/* {dislikes.length} */}
                            {/* </div> */}
                        {/* </div> */}
                    </div>
                    <p className="post-author-description">{postDescription}</p>
                    <div className="post-news-preview">
                        <a href={articleURL} target="_blank" rel="noreferrer nofollow">
                            {articleImage !== null && <img src={articleImage} className="post-news-image" alt="News pic"/>}
                            {articleImage === null && <img src={ImagePlaceholder} className="post-news-image-placeholder" alt="News pic"/>}
                        </a>
                        <a href={articleURL} className="post-news-title" target="_blank" rel="noreferrer nofollow"><h3>{articleTitle}</h3></a>
                    </div>
                    <div className="post-markets">
                        {markets.map((market, index) => {
                            if (index < markets.length-1) {
                                return (
                                    <h4 key={index}>&nbsp;{market}&nbsp;|</h4>
                                )
                            }
                            else return (
                                <h4 key={index}>&nbsp;{market}&nbsp;</h4>
                            )
                        })}
                    </div>
                </div>
                <div className="post-rating-container">
                    <h3 style={{ color: "#404d72" }}>Post Ratings:</h3>
                    {submittedRatings === false &&
                        <div>
                            <p>Submit a rating on all the below measures to see how everyone else reviewed it:</p>
                            <div className="post-rate-submission">
                                {submittedTruthfulRating === false && <div className="individual-post-rate-submission">
                                    <p>Truthful?</p>
                                    <div className="individual-post-rate-submission-button-container">
                                        <AiIcons.AiFillLike 
                                            size={25} 
                                            className="post-control-btn" 
                                            color={"green"} 
                                            onClick={() => { setTruthful(true); setSubmittedTruthfulRating(true)}}
                                            />
                                        <AiIcons.AiFillDislike 
                                            size={25} 
                                            className="post-control-btn" 
                                            color={"darkred"} 
                                            onClick={() => { setTruthful(false); setSubmittedTruthfulRating(true)}}
                                            />
                                    </div>
                                </div>}
                                {submittedRelevantRating === false && <div className="individual-post-rate-submission">
                                    <p>Relevant?</p>
                                    <div className="individual-post-rate-submission-button-container">
                                        <AiIcons.AiFillLike 
                                            size={25} 
                                            className="post-control-btn" 
                                            color={"green"} 
                                            onClick={() => { setRelevant(true); setSubmittedRelevantRating(true)}}
                                            />
                                        <AiIcons.AiFillDislike 
                                            size={25} 
                                            className="post-control-btn" 
                                            color={"darkred"} 
                                            onClick={() => { setRelevant(false); setSubmittedRelevantRating(true)}}
                                            />
                                    </div>
                                </div>}
                                {((submittedTruthfulRating === true && submittedRelevantRating === true) && submittedRatings === false) &&
                                    <button className="submit-ratings-btn" onClick={submitRatingOnPost}>Submit Ratings</button>
                                }
                            </div>
                        </div>
                    }
                    {(submittedRatings === true || cookie.username === author) &&
                        // show rating results
                        <div className="post-rate-results">
                            <p><b>{likes.length}</b> {likes.length === 1 ? "forecaster" : "forecasters"} liked this post.</p>
                            <p><b>{dislikes.length}</b> {dislikes.length === 1 ? "forecaster" : "forecasters"} disliked this post.</p>
                            <p><b>{truthfulRatingCount}</b> {truthfulRatingCount === 1 ? "forecaster" : "forecasters"} rated this post as Truthful.</p>
                            <p><b>{relevantRatingCount}</b> {relevantRatingCount === 1 ? "forecaster" : "forecasters"} rated this post as Relevant.</p>
                        </div>
                    }
                </div>
            </div>
            <div className="comments-container">
                <br />
                <h3 style={{ paddingBottom: "5px", color: "#404d72" }}>Comments</h3>
                <div className="comment-submit-field">
                    <input 
                        type="text" 
                        value={comment}
                        className="comment-field" 
                        onChange={(e) => handleCommentChange(e)}/>
                    <button 
                        className="submit-comment-btn"
                        onClick={() => submitNewComment(comment)}>
                        Post Comment
                    </button>
                </div>
                <div className="comments-sub-container">
                    {/* {showModal === true &&
                        <h3 style={{ "color": "#404d72"}}>You just earned 10 Fantasy Forecast Points for commenting!</h3>
                    } */}
                    {newCommentStatus === true && 
                        <div className="comment-in-chain">
                            <Link 
                                to={{pathname: "/my-profile"}}
                                onClick={() => localStorage.setItem("selectedPage", "Search")}
                                style={{ textDecoration: "none", color: "#404d72"}}>
                                    {/* CHARMANDER */}
                                    {/* <h4 className="comment-author">{localStorage.getItem("username")}</h4> */}
                                    <h4 className="comment-author">{cookie.username}</h4>
                            </Link>
                            <h4>{newCommentToRender}</h4>
                        </div>
                    }
                    {comments.map((item, index) => {
                        if (Array.isArray(item)) {
                            return (
                                item.map((subComment, subIndex) => {
                                    const usernameProps = {
                                        pathname: "/search",
                                        clickedUsername: subComment.author
                                    }
                                    return (
                                        <div 
                                            key={subIndex}
                                            className="comment-in-chain">
                                                <Link 
                                                    to={usernameProps}
                                                    onClick={() => localStorage.setItem("selectedPage", item.author === cookie.username ? "My Profile" : "Search")}>
                                                    <h4 className="comment-author"
                                                    style={{ textDecoration: "none" }}>{subComment.author}</h4>
                                                </Link>
                                                <h4>{subComment.comment}</h4>
                                        </div>
                                    )
                                })
                            ) 
                        } else if (typeof item === "object") {
                            const usernameProps = {
                                pathname: item.author === cookie.username ? "/my-profile" : "/search",
                                clickedUsername: item.author
                            }
                            return (
                                <div 
                                    key={index}
                                    className="comment-no-replies">
                                        <div className="author-details">
                                            <Link 
                                                to={usernameProps}
                                                onClick={() => localStorage.setItem("selectedPage", item.author === cookie.username ? "My Profile" : "Search")}
                                                style={{ textDecoration: "none" }}>
                                                <h4 className="comment-author">{item.author}</h4>
                                            </Link>
                                        </div>
                                        <p>{item.comment}</p>
                                </div>
                            )
                        } else return null;
                    })}
                </div>
            </div>
        </div>
    )
}

export default IndividualNewsFeedPost;
