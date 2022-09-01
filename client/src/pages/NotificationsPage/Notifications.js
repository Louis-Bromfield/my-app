import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './Notifications.css';
import { AiOutlineArrowRight } from 'react-icons/ai';

function Notifications(props) {
    const history = useHistory();
    useEffect(() => {
        console.log(props);
    }, []);

    // copy-paste this into Notifications.js when updated
    const handleNotificationSelection = (notification) => {
        // if it's problem related, go to forecasts page. Ideal would be it auto-selects from the dropdown for you
        if (notification.notificationSourcePath === "/forecast") {
            localStorage.setItem("selectedForecastID", notification.notificationSourceObjectID);
            localStorage.setItem("forecastSelectedFromNotifications", true);
            history.push("/forecast");
            return;
        // if it's post related, go to home page. Ideal would be it goes to individual news feed page with post already loaded
        } else if (notification.notificationSourcePath === "/news-post") {
            localStorage.setItem("postID", notification.notificationSourceObjectID);
            history.push("/news-post"); //replace this with news-post, not /home
            return;
        // if it's response to feedback, go to feedback page
        } else if (notification.notificationSourcePath === "/report-any-issues") {
            history.push("/report-any-issues");
            return;
        };
    };

    return (
    <div className="notifications">
        <h1>Notifications</h1>
        <div className="notifications-list">
            {props.location.userObj.notifications.map((item, index) => {
                return (
                    <div className="notification-page-item" onClick={() => handleNotificationSelection(item)}>
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