import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './Notifications.css';
import { AiOutlineArrowRight } from 'react-icons/ai';
import axios from 'axios';
import TeamModal from '../../components/TeamModal';

function Notifications(props) {
    const history = useHistory();
    const [selectedNotification, setSelectedNotification] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [selectedNotificationObject, setSelectedNotificationObject] = useState({});

    useEffect(() => {
        console.log(props.location.userObj);
        console.log(props.username);
    }, []);

    // copy-paste this into Notifications.js when updated
    /// copy-paste this into Notifications.js when updated
    const handleNotificationSelection = async (notification) => {
        // set seenByUser value to true
        // let username = props.location.userObj.username === undefined ? props.location.userObj.username : props.username;
        // if (changeAll === true) {
        //     const res = await axios.patch(`${process.env.REACT_APP_API_CALL_U}/editNotifications/${username}`, {
        //         setAllToTrue: true
        //     });
        //     setNumberOfNewNotis(0);
        //     return;
        // } else {
            if (notification.seenByUser === false) {
                const res = await axios.patch(`${process.env.REACT_APP_API_CALL_U}/editNotifications/${props.location.userObj.username}`, {
                
                    setAllToTrue: false,
                    notificationMessage: notification.notificationMessage,
                    notificationIndex: notification.notificationIndex
                });
                // setNumberOfNewNotis(numberOfNewNotis-1);
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
            // } else if (notification.notificationSourcePath === "/team-invite") {
            //     setShowConfirmationModal(true);
            } else if (notification.notificationSourcePath === "/profile") {
                history.push("/profile");
            }
        // };
    };

    return (
    <div className="notifications">
        {/* <TeamModal 
            show={showConfirmationModal}
            notificationObject={selectedNotification}
            username={props.location.userObj === undefined ? props.username === undefined ? "" : props.username : props.location.userObj.username}
            justClose={() => setShowConfirmationModal(false)}
            oldTeam={props.location.userObj === undefined ? props.userObject.teamName : "N/A"} 
            calledFromNav={false}
        /> */}
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