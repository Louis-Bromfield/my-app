import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ForecastChat.css';
import Modal from '../../../components/Modal';
import axios from 'axios';

function ForecastChat(props) {
    const [chat, setChat] = useState([props.forecast.chat]);
    const [comment, setComment] = useState("");
    const [replyComment, setReplyComment] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [newCommentToRender, setNewCommentToRender] = useState({});
    const [newCommentStatus, setNewCommentStatus] = useState(false);
    const [newReplyCommentToRender, setNewReplyCommentToRender] = useState();
    const [newReplyCommentStatus, setNewReplyCommentStatus] = useState(false);
    const [idForCommentToReplyTo, setIDForCommentToReplyTo] = useState();

    useEffect(() => {
        console.log("ForecastChat UE");
    }, [props]);

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
    };

    const handleReplyCommentChange = (e) => {
        setReplyComment(e.target.value);
    };

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
                const res = await axios.patch(`${process.env.REACT_APP_API_CALL_F}/addNewComment`, {
                    problemName: props.forecast.problemName,
                    isFirstComment: true,
                    author: props.username,
                    comment: comment
                });
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
            try {
                const res = await axios.patch(`${process.env.REACT_APP_API_CALL_F}/addNewComment`, {
                    problemName: props.forecast.problemName,
                    isFirstComment: false,
                    author: props.username,
                    comment: comment,
                    commentToReplyTo: commentYouAreRespondingTo.comment
                });
                if (props.username !== commentYouAreRespondingTo.author) {
                    await axios.patch(`${process.env.REACT_APP_API_CALL_U}/newNotification/${commentYouAreRespondingTo.author}`, {
                    
                        notificationMessage: `${props.username === undefined ? "Someone" : props.username} just replied to your comment!`,
                        notificationSourcePath: "/forecasts",
                        notificationSourceObjectID: props.forecast._id,
                    });
                };
            } catch (err) {
                console.error(err);
            };
        };
    };

    return (
        <div className="forecast-chat">
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
            <h2 style={{ color: "#404d72" }}>
                Forecast Chat
            </h2>
            <div className="chat">
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
                <div className="chat">
                    {newCommentStatus === true &&
                        <div className="chat-item">
                            <h4>
                                <Link 
                                    to={newCommentToRender.author === props.username ? {pathname: "/my-profile"} : {pathname: "/search", clickedUsername: newCommentToRender.author}}
                                    onClick={() => localStorage.setItem("selectedPage", "Search")}
                                    style={{ textDecoration: "none", color: "#404d72"}}>
                                        {newCommentToRender.author}
                                </Link> | {newCommentToRender.date !== undefined ? newCommentToRender.date.slice(0, 21) : newCommentToRender.date}</h4>
                            <p>{newCommentToRender.comment}</p>
                        </div>
                    }
                    {props.forecast.chat !== undefined ? props.forecast.chat.map((item, index) => {
                        return (
                            <div key={item} className="chat-item">
                                <h4>
                                    <Link 
                                        to={item.author === props.username ? {pathname: "/my-profile"} : {pathname: "/search", clickedUsername: item.author}}
                                        onClick={() => localStorage.setItem("selectedPage", "Search")}
                                        style={{ textDecoration: "none", color: "#404d72"}}>
                                            {item.author}
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
                                                    {newReplyCommentToRender.author}
                                            </Link> | {newReplyCommentToRender.date !== undefined ? newReplyCommentToRender.date.slice(0, 21) : newReplyCommentToRender.date}

                                            </h4>
                                        <p>{newReplyCommentToRender.comment}</p>
                                    </li>
                                }
                                <div className="sub-comment-submit-field">
                                    <input 
                                        type="text" 
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
                    }) : null}
                </div>
            </div>
        </div>
    )
}

export default ForecastChat;