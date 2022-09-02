import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './Notifications.css';
import { AiOutlineArrowRight } from 'react-icons/ai';
import axios from 'axios';

function Notifications(props) {
    const history = useHistory();
    useEffect(() => {
        console.log(props);
    }, []);

    // copy-paste this into Notifications.js when updated
    /// copy-paste this into Notifications.js when updated
    const handleNotificationSelection = async (notification) => {
        // set seenByUser value to true
        // let username = props.location.userObj.username === undefined ? props.location.userObj.username : props.username;
        // if (changeAll === true) {
        //     const res = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/editNotifications/${username}`, {
        //         setAllToTrue: true
        //     });
        //     setNumberOfNewNotis(0);
        //     console.log(res);
        //     return;
        // } else {
            if (notification.seenByUser === false) {
                const res = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/editNotifications/${props.location.userObj.username}`, {
                    setAllToTrue: false,
                    notificationMessage: notification.notificationMessage,
                    notificationIndex: notification.notificationIndex
                });
                // setNumberOfNewNotis(numberOfNewNotis-1);
                console.log(res);
            };
            // if it's problem related, go to forecasts page. Ideal would be it auto-selects from the dropdown for you
            if (notification.notificationSourcePath === "/forecast") {
                localStorage.setItem("selectedForecastID", notification.notificationSourceObjectID);
                localStorage.setItem("forecastSelectedFromNotifications", true);
                // setShowNotifications(false);
                history.push("/forecast");
                return;
            // if it's post related, go to home page. Ideal would be it goes to individual news feed page with post already loaded
            } else if (notification.notificationSourcePath === "/news-post") {
                localStorage.setItem("postID", notification.notificationSourceObjectID);
                history.push("/news-post"); //replace this with news-post, not /home
                // setShowNotifications(false);
                return;
            // if it's response to feedback, go to feedback page
            } else if (notification.notificationSourcePath === "/report-any-issues") {
                history.push("/report-any-issues");
                // setShowNotifications(false);
                return;
            };
        // };
    };

    return (
    <div className="notifications">
        <h1>Notifications</h1>
        <div className="notifications-list">
            {props.location.userObj.notifications.map((item, index) => {
                return (
                    <div className={item.seenByUser === false ? "notification-page-item-new" : "notification-page-item-seen"} onClick={() => { handleNotificationSelection(item); item.seenByUser = true;}}>
                        <div className="notification-item-info">
                            <p>{item.notificationMessage}</p>
                            <p>{new Date(item.date).toString().slice(0, 21)}</p>
                        </div>
                        <AiOutlineArrowRight color={"#404d72"}/>
                    </div>
                )
            })}
        </div>
    </div>
    )
}

export default Notifications;