import React, { useState, useEffect } from 'react';
import './IndividualNewsFeedPost.css';
import * as AiIcons from 'react-icons/ai';
import ImagePlaceholder from '../../../media/sd.png';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';

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
    const history = useHistory();

    useEffect(async () => {
        if (props.location.postObject === undefined) {
            const res = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/homePageNewsFeedPosts/${localStorage.getItem("postID")}`);
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
            setComments(res.data.comments);
        } else {
            setAuthor(props.location.postObject.author);
            setAuthorProfilePicture(props.location.postObject.authorProfilePicture);
            setPostDescription(props.location.postObject.postDescription);
            setPostDate(props.location.postObject.postDate);
            setLikes(props.location.postObject.likes);
            setDislikes(props.location.postObject.dislikes);
            setArticleImage(props.location.postObject.articleImage);
            setArticleTitle(props.location.postObject.articleTitle);
            setArticleURL(props.location.postObject.articleURL);
            setMarkets(props.location.postObject.markets);
            setComments(props.location.postObject.comments);
        }
    }, []);

    const handleCommentChange = (e) => {
        setComment(e.target.value);
        setNewCommentStatus(false);
    };

    const submitNewComment = async (comment) => {
        const ID = props.location.postObject._id === undefined ? localStorage.getItem("postID") : props.location.postObject._id 
        try {
            const res = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/homePageNewsFeedPosts/postComment/${ID}`, 
            {
                postID: ID,
                isNewComment: true,
                newComment: comment,
                author: localStorage.getItem("username")
            });
            setNewCommentStatus(true);
            setNewCommentToRender(comment)
            setComment("");
        } catch (error) {
            console.error("Error in IndividualNewsFeedPost > submitComment");
            console.error(error);
        };
    };

    // const submitReplyComment = async (comment, commentToReplyTo) => {
    //     try {
    //         const res = await axios.patch(`http://localhost:5000/homePageNewsFeedPosts/postComment/${props.location.postObject._id}`, 
    //         {
    //             postID: props.location.postObject._id,
    //             isNewComment: false,
    //             commentToReplyTo: commentToReplyTo,
    //             newComment: comment,
    //             author: localStorage.getItem("username")
    //         });
    //     } catch (error) {
    //         console.error("Error in IndividualNewsFeedPost > submitComment");
    //         console.error(error);
    //     };
    // };

    return (
        <div className="individual-post-container">
            <button 
                className="post-button"
                onClick={() => history.push("/")}>
                    Return to Home
            </button>
            <div className="post-container">
                <div key={1} className="individual-news-feed-post">
                    <div className="post-author">
                        <div className="post-author-left">
                            <img className="author-profile-pic" src={author === localStorage.getItem("username") ? localStorage.getItem("profilePicture") : authorProfilePicture} alt=""/>
                            <div className="post-author-details">
                                <Link 
                                    to={{pathname: "/search", clickedUsername: author}}
                                    onClick={() => localStorage.setItem("selectedPage", "Search")}
                                    style={{ textDecoration: "none", color: "#404d72"}}>
                                        <h3>{author}</h3>
                                </Link>
                                <h5>{new Date(postDate).toString().slice(0, 21)}</h5>
                            </div>
                        </div>
                        <div className="post-author-right">
                            <div className="post-votes">
                                <AiIcons.AiFillLike 
                                    size={25} 
                                    className="post-control-btn" 
                                    color={"green"} />
                                    {/* onClick={() => voteOnPost("upvote", _id, likes)} /> */}
                                    {likes.length}
                                <AiIcons.AiFillDislike 
                                    size={25} 
                                    className="post-control-btn" 
                                    color={"darkred"} />
                                    {/* onClick={() => voteOnPost("downvote", _id, dislikes)} /> */}
                                    {dislikes.length}
                            </div>
                        </div>
                    </div>
                    <p className="post-author-description">{postDescription}</p>
                    <div className="post-news-preview">
                        <a href={articleURL} target="_blank" rel="noreferrer nofollow">
                            {articleImage !== "" && <img src={articleImage} className="post-news-image" alt="News pic"/>}
                            {articleImage === "" && <img src={ImagePlaceholder} className="post-news-image-placeholder" alt="News pic"/>}
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
                                                    onClick={() => localStorage.setItem("selectedPage", "Search")}>
                                                    <h4 className="comment-author">{subComment.author}</h4>
                                                </Link>
                                                <h4>{subComment.comment}</h4>
                                        </div>
                                    )
                                })
                            ) 
                        } else if (typeof item === "object") {
                            const usernameProps = {
                                pathname: "/search",
                                clickedUsername: item.author
                            }
                            return (
                                <div 
                                    key={index}
                                    className="comment-no-replies">
                                        <div className="author-details">
                                            <Link 
                                                to={usernameProps}
                                                onClick={() => localStorage.setItem("selectedPage", "Search")}>
                                                <h4 className="comment-author">{item.author}</h4>
                                            </Link>
                                        </div>
                                        <h4>{item.comment}</h4>
                                </div>
                            )
                        } else return null;
                    })}
                    {newCommentStatus === true && 
                        <div className="comment-in-chain">
                            <Link 
                                to={{pathname: "/search", clickedUsername: author}}
                                onClick={() => localStorage.setItem("selectedPage", "Search")}
                                style={{ textDecoration: "none", color: "#404d72"}}>
                                    <h4 className="comment-author">{localStorage.getItem("username")}</h4>
                            </Link>
                            <h4>{newCommentToRender}</h4>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default IndividualNewsFeedPost;
