import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ForecastChat.css';
import { FaInfoCircle } from 'react-icons/fa';
import Modal from '../../../components/Modal';
import axios from 'axios';
import * as AiIcons from 'react-icons/ai';

function ForecastChat(props) {
    const [chat, setChat] = useState([props.forecast.chat]);
    const [comment, setComment] = useState("");
    const [replyComment, setReplyComment] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [newCommentToRender, setNewCommentToRender] = useState();
    const [newCommentStatus, setNewCommentStatus] = useState(false);
    const [newReplyCommentToRender, setNewReplyCommentToRender] = useState();
    const [newReplyCommentStatus, setNewReplyCommentStatus] = useState(false);
    const [idForCommentToReplyTo, setIDForCommentToReplyTo] = useState();

    useEffect(() => {
        console.log("ForecastChat UE");
        console.log(props);
    }, []);

    const findLastCertainty = (userToFind) => {
        let found = false;
        for (let i = 0; i < props.forecast.submittedForecasts.length; i++) {
            if (props.forecast.submittedForecasts[i].username === userToFind) {
                found = true;
                if (props.forecast.singleCertainty === true) {
                    return props.forecast.submittedForecasts[i].forecasts[props.forecast.submittedForecasts[i].forecasts.length-1].certainty*100;
                } else {
                    return `${props.forecast.submittedForecasts[i].forecasts[props.forecast.submittedForecasts[i].forecasts.length-1].certainty1*100}%-${props.forecast.submittedForecasts[i].forecasts[props.forecast.submittedForecasts[i].forecasts.length-1].certainty2*100}%-${props.forecast.submittedForecasts[i].forecasts[props.forecast.submittedForecasts[i].forecasts.length-1].certainty3*100}%`
                }
            };
        };
        if (found === false) {
            return "~";
        }
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
        // setNewCommentStatus(false);
    };

    const handleReplyCommentChange = (e) => {
        setReplyComment(e.target.value);
        // setNewCommentStatus(false);
    };

    // CHARMANDER
    const submitNewComment = async (comment) => {
        if (props.username === "Guest") {
            setShowModal(true);
            setModalContent("You must be logged into your own account to post a comment here.");
            return;
        } else {
            try {
                if (comment === "" || (/\s/.test(comment))) {
                    return;
                };
                const commentToRender = {
                    comment: comment,
                    author: props.username,
                    date: new Date().toString(),
                    replies: [],
                };
                setNewCommentStatus(true);
                setNewCommentToRender(commentToRender);
                console.log(newCommentStatus);
                const res = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/forecasts/addNewComment`, {
                    problemName: props.forecast.problemName,
                    isFirstComment: true,
                    author: props.username,
                    comment: comment
                });
                // const commentToRender = {
                //     comment: comment,
                //     author: props.username,
                //     date: new Date().toString(),
                //     replies: [],
                // };
                // setNewCommentStatus(true);
                // setNewCommentToRender(commentToRender);
                // console.log(newCommentStatus);
                console.log(res);
            } catch (err) {
                console.error(err);
            };
        };
    };

    const submitNewReply = async (comment, commentYouAreRespondingTo, commentIndex) => {
        if (props.username === "Guest") {
            setShowModal(true);
            setModalContent("You must be logged into your own account to reply to this comment.");
            return;
        } else {
            console.log(comment);
            console.log(commentYouAreRespondingTo);
            if (comment === "" || (/\s/.test(comment))) {
                return;
            };
            const commentToRender = {
                comment: comment,
                author: props.username,
                date: new Date().toString(),
                replies: [],
            };
            setNewReplyCommentStatus(true);
            setIDForCommentToReplyTo(commentIndex);
            setNewReplyCommentToRender(commentToRender);
            console.log(newCommentStatus);
            try {
                const res = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/forecasts/addNewComment`, {
                    problemName: props.forecast.problemName,
                    isFirstComment: false,
                    author: props.username,
                    comment: comment,
                    commentToReplyTo: commentYouAreRespondingTo.comment
                });
                console.log(res);
            } catch (err) {
                console.error(err);
            };
            // Maybe add a reply button next to every comment
            // and then when you click it a comment field identicial to the 
            // current one appears but instead of "Post Comment" on the submit
            // button it says "Reply to LouisB" or "Reply to MattW" etc
        };
    };
    // CHARMANDER

    return (
        <div className="forecast-chat">
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
            <h2 style={{ color: "#404d72" }}>
                Forecast Chat
                <FaInfoCircle 
                    onClick={() => {
                        setShowModal(true);
                        setModalContent(`The percentages next to each username below are that user's most recent forecast for this problem.`)
                    }}
                    style={{ "color": "orange", "cursor": "pointer" }}
                />
            </h2>
            <div className="chat">
            {/* New comment input field */}
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
            {/* Show all comments */}
                <div className="chat">
                    {newCommentStatus === true &&
                        // <h3>HAHAHHAAHAHHA</h3>
                        <div key={newCommentToRender.comment} className="chat-item">
                            <h4>
                                <Link 
                                    to={newCommentToRender.author === props.username ? {pathname: "/my-profile"} : {pathname: "/search", clickedUsername: newCommentToRender.author}}
                                    onClick={() => localStorage.setItem("selectedPage", "Search")}
                                    style={{ textDecoration: "none", color: "#404d72"}}>
                                        {newCommentToRender.author} ({findLastCertainty(newCommentToRender.author)}%)
                                </Link> | {newCommentToRender.date !== undefined ? newCommentToRender.date.slice(0, 21) : newCommentToRender.date}</h4>
                            <p>{newCommentToRender.comment}</p>
                            {newCommentToRender.replies.map((newItem, newIndex) => {
                                if (newCommentToRender.replies.length > 0) {
                                    return (
                                        <li key={newItem} className="reply-chat-item">
                                            <h4>
                                                <Link 
                                                    to={newItem.author === props.username ? {pathname: "/my-profile"} : {pathname: "/search", clickedUsername: newItem.author}}
                                                    onClick={() => localStorage.setItem("selectedPage", "Search")}
                                                    style={{ textDecoration: "none", color: "#404d72"}}>
                                                        {newItem.author} ({findLastCertainty(newItem.author)}%)
                                                </Link> | {newItem.date !== undefined ? newItem.date.slice(0, 21) : newItem.date}</h4>
                                            <p>{newItem.comment}</p>
                                        </li>
                                    )
                                } else return null;
                            })}
                            {/* <div className="sub-comment-submit-field">
                                <input 
                                    type="text" 
                                    // value={replyComment}
                                    className="comment-field" 
                                    onChange={(e) => handleReplyCommentChange(e)}/>
                                <button 
                                    className="submit-comment-btn"
                                    onClick={() => submitNewReply(replyComment, newCommentToRender)}>
                                    Reply
                                </button>
                            </div> */}
                        </div>
                    }
                    {props.forecast.chat.map((item, index) => {
                        return (
                            <div key={item} className="chat-item">
                                <h4>
                                    <Link 
                                        to={item.author === props.username ? {pathname: "/my-profile"} : {pathname: "/search", clickedUsername: item.author}}
                                        onClick={() => localStorage.setItem("selectedPage", "Search")}
                                        style={{ textDecoration: "none", color: "#404d72"}}>
                                            {item.author} ({findLastCertainty(item.author)}%)
                                    </Link> | {item.date !== undefined ? item.date.slice(0, 21) : item.date}</h4>
                                <p>{item.comment}</p>
                                {item.replies.map((newItem, newIndex) => {
                                    if (item.replies.length > 0) {
                                        return (
                                            <li key={newItem} className="reply-chat-item">
                                                <h4>
                                                    <Link 
                                                        to={newItem.author === props.username ? {pathname: "/my-profile"} : {pathname: "/search", clickedUsername: newItem.author}}
                                                        onClick={() => localStorage.setItem("selectedPage", "Search")}
                                                        style={{ textDecoration: "none", color: "#404d72"}}>
                                                            {newItem.author} ({findLastCertainty(newItem.author)}%)
                                                    </Link> | {newItem.date !== undefined ? newItem.date.slice(0, 21) : newItem.date}

                                                    </h4>
                                                <p>{newItem.comment}</p>
                                            </li>
                                        )
                                    } else return null;
                                })}
                                {(newReplyCommentStatus === true && index === idForCommentToReplyTo) &&
                                    <li key={newReplyCommentToRender} className="reply-chat-item">
                                        <h4>
                                            <Link 
                                                to={newReplyCommentToRender.author === props.username ? {pathname: "/my-profile"} : {pathname: "/search", clickedUsername: newReplyCommentToRender.author}}
                                                onClick={() => localStorage.setItem("selectedPage", "Search")}
                                                style={{ textDecoration: "none", color: "#404d72"}}>
                                                    {newReplyCommentToRender.author} ({findLastCertainty(newReplyCommentToRender.author)}%)
                                            </Link> | {newReplyCommentToRender.date !== undefined ? newReplyCommentToRender.date.slice(0, 21) : newReplyCommentToRender.date}

                                            </h4>
                                        <p>{newReplyCommentToRender.comment}</p>
                                    </li>
                                }
                                {/* <hr /> */}
                                {/* Add a comment field here (think Instagram, not replying to specific people but just add your comment 
                                    to this particular thread for now) */}
                                <div className="sub-comment-submit-field">
                                    <input 
                                        type="text" 
                                        // value={replyComment}
                                        className="comment-field" 
                                        onChange={(e) => handleReplyCommentChange(e)}/>
                                    <button 
                                        className="submit-comment-btn"
                                        onClick={() => submitNewReply(replyComment, item, index)}>
                                        Reply
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ForecastChat;