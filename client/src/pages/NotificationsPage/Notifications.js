import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './Notifications.css';
import { AiOutlineArrowRight } from 'react-icons/ai';
import axios from 'axios';

function Notifications(props) {
    const history = useHistory();
    const [selectedNotification, setSelectedNotification] = useState({});

    useEffect(() => {
        console.log(props.location.userObj);
        console.log(props.username);
    }, []);

    const handleNotificationSelection = async (notification) => {
            if (notification.seenByUser === false) {
                await axios.patch(`${process.env.REACT_APP_API_CALL_U}/editNotifications/${props.location.userObj.username}`, {
                    setAllToTrue: false,
                    notificationMessage: notification.notificationMessage,
                    notificationIndex: notification.notificationIndex
                });
            };
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
            } else if (notification.notificationSourcePath === "/profile") {
                history.push("/profile");
            }
    };

    return (
    <div className="notifications">
        <h1>Notifications</h1>
        <p>Click on the notification to view it and be redirected to the relevant page!</p>
        <div className="notifications-list">
            {(props.location.userObj !== undefined && props.location.userObj.notifications.length === 0) && <h3>You have no notifications to show here yet!</h3>}
            {props.location.userObj !== undefined ? props.location.userObj.notifications.map((item, index) => {
                return (
                    <div className={item.seenByUser === false ? "notification-page-item-new" : "notification-page-item-seen"} onClick={() => { setSelectedNotification(item); handleNotificationSelection(item); item.seenByUser = true;}}>
                        <div className="notification-item-info">
                            <p>{item.notificationMessage}</p>
                            <p>{new Date(item.date).toString().slice(0, 21)}</p>
                        </div>
                        <AiOutlineArrowRight color={"#404d72"}/>
                    </div>
                )
            }) : null}
        </div>
    </div>
    )
}

export default Notifications;