import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { NavbarData } from './NavbarData';
import { IconContext } from 'react-icons';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import FantasyForecastLogo from '../../media/sd3.png';
import { AiOutlineArrowRight } from 'react-icons/ai';
import axios from 'axios';
import TeamModal from '../TeamModal';

function Navbar(props) {
    const [selectedPage, setSelectedPage] = useState("Home");
    const [width, setWidth] = useState(window.innerWidth > 1100);
    const [mobileWidth, setMobileWidth] = useState(window.innerWidth > 650);
    const [sidebar, setSidebar] = useState(false);
    const [profilePicture, setProfilePicture] = useState(props.profilePicture);
    const [showNotifications, setShowNotifications] = useState(false);
    const [numberOfNewNotis, setNumberOfNewNotis] = useState(0);
    const [profilePicStyle, setProfilePicStyle] = useState("none");
    const [linkObject, setLinkObject] = useState({
        pathname: "/notifications",
        userObj: props.userObj
    });
    const [confirmationModalContent, setConfirmationModalContent] = useState("");
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [selectedNotificationObject, setSelectedNotificationObject] = useState({});

    const history = useHistory();

    const showSidebar = () => setSidebar(!sidebar);

    const updateWidth = () => {
        setWidth(window.innerWidth > 1100);
        setMobileWidth(window.innerWidth <= 650);
    };

    useEffect(() => {
        setProfilePicture(props.profilePicture);
        let numberOfNewNotifications = 0;
        if (props.userObj.notifications !== undefined) {
            for (let i = 0; i < props.userObj.notifications.length; i++) {
                if (props.userObj.notifications[i].seenByUser === false) {
                    numberOfNewNotifications = numberOfNewNotifications + 1;
                };
            };
            setNumberOfNewNotis(numberOfNewNotifications);
        };
        if (props.userObj.fantasyForecastPoints < 500) {
        } else if (props.userObj.fantasyForecastPoints >= 500 && props.userObj.fantasyForecastPoints < 1000) {
        } else if (props.userObj.fantasyForecastPoints >= 1000 && props.userObj.fantasyForecastPoints < 1500) {
        } else if (props.userObj.fantasyForecastPoints >= 1500 && props.userObj.fantasyForecastPoints < 2000) {
            setProfilePicStyle("2px solid #cd7f32")
        } else if (props.userObj.fantasyForecastPoints >= 2000 && props.userObj.fantasyForecastPoints < 2500) {
            setProfilePicStyle("2px solid silver")
        } else if (props.userObj.fantasyForecastPoints >= 2500 && props.userObj.fantasyForecastPoints < 3000) {
            setProfilePicStyle("2px solid goldenrod")
        } else if (props.userObj.fantasyForecastPoints >= 3000 && props.userObj.fantasyForecastPoints < 3500) {
            setProfilePicStyle("2px solid goldenrod")
        } else if (props.userObj.fantasyForecastPoints >= 3500 && props.userObj.fantasyForecastPoints < 4000) {
            setProfilePicStyle("2px solid goldenrod")
        } else if (props.userObj.fantasyForecastPoints >= 4000 && props.userObj.fantasyForecastPoints < 4500) {
            setProfilePicStyle("2px solid goldenrod")
        } else if (props.userObj.fantasyForecastPoints >= 4500 && props.userObj.fantasyForecastPoints < 5000) {
            setProfilePicStyle("2px solid goldenrod")
        } else if (props.userObj.fantasyForecastPoints >= 5000) {
            setProfilePicStyle("5px solid #383D67")
        };
        setWidth(window.innerWidth > 1350);
        setMobileWidth(window.innerWidth <= 650);
        setLinkObject({
            pathname: "/notifications",
            userObj: props.userObj
        })
        window.addEventListener("resize", updateWidth);
        return () => window.addEventListener("resize", updateWidth);
    }, [props.profilePicture]);

    const signOut = (logout) => {
        logout();
    };

    const handleNotificationSelection = async (notification) => {
        let username = props.username === undefined ? props.userObj.username : props.username;
            if (notification.seenByUser === false) {
                const res = await axios.patch(`${process.env.REACT_APP_API_CALL_U}/editNotifications/${username}`, {
                
                    setAllToTrue: false,
                    notificationMessage: notification.notificationMessage,
                    notificationIndex: notification.notificationIndex
                });
                setNumberOfNewNotis(numberOfNewNotis-1);
            };
            // if it's problem related, go to forecasts page. Ideal would be it auto-selects from the dropdown for you
            if (notification.notificationSourcePath === "/forecast") {
                localStorage.setItem("selectedForecastID", notification.notificationSourceObjectID);
                localStorage.setItem("forecastSelectedFromNotifications", true);
                setShowNotifications(false);
                history.push("/forecast");
                return;
            // if it's post related, go to home page. Ideal would be it goes to individual news feed page with post already loaded
            } else if (notification.notificationSourcePath === "/news-post") {
                localStorage.setItem("postID", notification.notificationSourceObjectID);
                history.push("/news-post"); //replace this with news-post, not /home
                setShowNotifications(false);
                return;
            // if it's response to feedback, go to feedback page
            } else if (notification.notificationSourcePath === "/report-any-issues") {
                history.push("/report-any-issues");
                setShowNotifications(false);
                return;
            } else if (notification.notificationSourcePath === "/team-invite") {
                setShowConfirmationModal(true);
            } else if (notification.notificationSourcePath === "/profile") {
                history.push("/profile");
            }
    };

    return (
        <>
            {mobileWidth === true &&
                <IconContext.Provider value={{ color: '#fff' }}>
                    <div className='mobile-navbar'>
                        <Link to='#' className='mobile-menu-bars'>
                            <FaIcons.FaBars onClick={showSidebar} />
                        </Link>
                        <div className="mobile-image-and-noti-container">
                            <img src={profilePicture} className="mobile-navbar-profile-pic" alt="User's profile pic" style={{border: profilePicStyle}} onClick={() => setShowNotifications(!showNotifications)}/>
                            {numberOfNewNotis > 0 ? <h3 className="notification-counter" onClick={() => setShowNotifications(!showNotifications)}>{numberOfNewNotis}</h3> : null}
                        </div>
                    </div>
                    <nav className={sidebar ? 'mobile-nav-menu active' : 'mobile-nav-menu'}>
                        <ul className='mobile-nav-menu-items' onClick={showSidebar}>
                            <li className='mobile-navbar-toggle'>
                            <Link to='#' className='mobile-menu-bars'>
                                <AiIcons.AiOutlineClose />
                            </Link>
                    </li>
                    {NavbarData.map((item, index) => {
                        if (localStorage.getItem('selectedPage') === item.title) {
                            return (
                                <li 
                                    key={index} 
                                    className="mobile-nav-text-selected"
                                    onClick={() => { localStorage.setItem('selectedPage', item.title); setSelectedPage(item.title); setShowNotifications(false)}}>
                                        <Link to={item.path}>
                                            {item.iconSelected}
                                            <span className="mobile-nav-title">{item.title}</span>
                                        </Link>
                                </li>
                            )
                        } else {
                            return (
                                <li 
                                    key={index} 
                                    className="mobile-nav-text"
                                    onClick={() => { localStorage.setItem('selectedPage', item.title); setSelectedPage(item.title); setShowNotifications(false)}}>
                                        <Link to={item.path}>
                                            {item.icon}
                                            <span className="mobile-nav-title">{item.title}</span>
                                        </Link>
                                </li>
                            );
                        };
                    })}
                    <li>
                        <button 
                            className="mobile-nav-logout-btn" 
                            onClick={() => {
                                signOut(props.logOut); 
                                history.push("/")
                            }}>
                                Log Out
                        </button>
                    </li>
                    </ul>
                </nav>
                {showNotifications === true && 
                    <div className="notification-dropdown">
                        {/* each item to be message above date in left column, and right column to be an arrow icon pointing right */}
                        {props.userObj.notifications !== undefined ? props.userObj.notifications.map((item, index) => {
                            if (index < 5) {
                                return (
                                    <div className={item.seenByUser === false ? "notification-item-new" : "notification-item-seen"} onClick={() => { handleNotificationSelection(item); item.seenByUser = true; }}>
                                        <div className="notification-item-info">
                                            <p>{item.seenByUser === false ? <b>NEW</b> : ""} {item.notificationMessage.length > 75 ? `${item.notificationMessage.slice(0, 75)}...` : item.notificationMessage}</p>
                                            <p>{new Date(item.date).toString().slice(0, 21)}</p>
                                        </div>
                                        <AiOutlineArrowRight color={"#404d72"}/>
                                    </div>
                                )
                            } else return null;
                        }) : null}
                        <Link className="notification-item-seen" onClick={() => setShowNotifications(false)} to={linkObject}>
                            <div className="notification-item-info">
                                <p><b>See all notifications</b></p>
                            </div>
                            <AiOutlineArrowRight color={"#404d72"}/>
                        </Link>
                    </div>
                }
            </IconContext.Provider>   
            }
            {mobileWidth === false &&
                <IconContext.Provider value ={{ color: "#fff" }}>
                            <div className="navbar">
                                <div className="navbar-column" style={{ display: "flex", flexDirection: "column", margin: "0 auto", paddingTop: "1%" }}>
                                        <img 
                                            className="nav-logo" 
                                            src={FantasyForecastLogo} 
                                            alt="Fantasy Forecast Logo" 
                                            style={{ 
                                                width: "30%", 
                                                margin: "0 auto"
                                                // marginBottom: "0.5vh"
                                            }}/>
                                    <div className="nav-menu-items-container">
                                        {width === false &&
                                            <ul className="nav-menu-items">
                                                {NavbarData.map((item, index) => {
                                                    if (item.title !== "My Profile") {
                                                        if (localStorage.getItem('selectedPage') === item.title) {
                                                            return (
                                                                <li 
                                                                    key={index} 
                                                                    className="nav-text-selected" 
                                                                    onClick={() => { localStorage.setItem('selectedPage', item.title); setSelectedPage(item.title); setShowNotifications(false)}}>
                                                                        <Link to={item.path}>
                                                                            {item.iconSelected}
                                                                        </Link>
                                                                </li>
                                                                )
                                                        } else {
                                                            return (
                                                                <li 
                                                                key={index} 
                                                                className="nav-text" 
                                                                onClick={() => { localStorage.setItem('selectedPage', item.title); setSelectedPage(item.title); setShowNotifications(false)}}>
                                                                    <Link to={item.path}>
                                                                        {item.icon}
                                                                    </Link>
                                                                </li>
                                                            );
                                                        };
                                                    } else {
                                                        return (
                                                            <li 
                                                                key={index} 
                                                                className={localStorage.getItem("selectedPage") === item.title ? "nav-text-selected" : "nav-text"}
                                                                onClick={() => setShowNotifications(!showNotifications)}>
                                                                    <Link>
                                                                        {item.iconSelected}
                                                                        {numberOfNewNotis > 0 ? <h5 className="notification-counter" style={{ height: "100%" }}>{numberOfNewNotis}</h5> : null}
                                                                    </Link>
                                                            </li>
                                                        )
                                                    }
                                                })}
                                            </ul>
                                            }
                                            {width === true &&
                                            <ul className="nav-menu-items">
                                                {NavbarData.map((item, index) => {
                                                    if (item.title !== "My Profile") {
                                                        return (
                                                            <li 
                                                                key={index} 
                                                                className={localStorage.getItem("selectedPage") === item.title ? "nav-text-selected" : "nav-text"}
                                                                onClick={() => { localStorage.setItem('selectedPage', item.title); setSelectedPage(item.title); setShowNotifications(false)}}>
                                                                    <Link to={item.path}>
                                                                        {item.iconSelected}
                                                                        <span className="nav-title"><p>{item.title}</p></span>
                                                                    </Link>
                                                            </li>
                                                        )
                                                    } else {
                                                        return (
                                                            <li 
                                                                key={index} 
                                                                className={localStorage.getItem("selectedPage") === item.title ? "nav-text-selected" : "nav-text"}
                                                                onClick={() => setShowNotifications(!showNotifications)}>
                                                                    <Link>
                                                                        {item.iconSelected}
                                                                        <span className="nav-title"><p>{item.title}</p></span>
                                                                        {numberOfNewNotis > 0 ? <h5 className="notification-counter" style={{ height: "100%" }}>{numberOfNewNotis}</h5> : null}
                                                                    </Link>
                                                            </li>
                                                        )
                                                    }
                                                })}
                                                {showNotifications === true && 
                                                    <div className="notification-dropdown">
                                                        {props.userObj.notifications !== undefined ? props.userObj.notifications.map((item, index) => {
                                                            if (index < 5) {
                                                                return (
                                                                    <div className={item.seenByUser === false ? "notification-item-new" : "notification-item-seen"} onClick={() => { setSelectedNotificationObject(item); handleNotificationSelection(item); item.seenByUser = true; }}>
                                                                        <div className="notification-item-info">
                                                                            <p>{item.seenByUser === false ? <b>NEW</b> : ""} {item.notificationMessage.length > 75 ? `${item.notificationMessage.slice(0, 75)}...` : item.notificationMessage}</p>
                                                                            <p>{new Date(item.date).toString().slice(0, 21)}</p>
                                                                        </div>
                                                                        <AiOutlineArrowRight color={"#404d72"}/>
                                                                    </div>
                                                                )
                                                            } else return null;
                                                        }) : null}
                                                        {/* Might want to replace this div with a Link so we can pass in props like userObj / username to access notifications array */}
                                                        <Link className="notification-item-seen" onClick={() => setShowNotifications(false)} to={linkObject}>
                                                            <div className="notification-item-info">
                                                                <p><b>See all notifications</b></p>
                                                            </div>
                                                            <AiOutlineArrowRight color={"#404d72"}/>
                                                        </Link>
                                                        <div className="profile-and-logout-container">
                                                                <Link 
                                                                    to={"/my-profile"} 
                                                                    className="nav-text-profile" 
                                                                    onClick={() => {
                                                                        localStorage.setItem('selectedPage', 'My Profile'); 
                                                                        setSelectedPage("My Profile");
                                                                        setShowNotifications(false)}}>
                                                                    <h5>Go to My Profile</h5>
                                                                </Link>
                                                            <button 
                                                                className="nav-logout-btn" 
                                                                onClick={() => {
                                                                    signOut(props.logOut); 
                                                                    history.push("/")
                                                                }}>
                                                                    <p>Log Out</p>
                                                                </button>
                                                        </div>
                                                    </div>
                                                }
                                            </ul>
                                            }
                                    </div>
                                    <div className="user-logout-container">
                                        {showNotifications === true && 
                                            <div className="notification-dropdown">
                                                {props.userObj.notifications !== undefined ? props.userObj.notifications.map((item, index) => {
                                                    if (index < 5) {
                                                        return (
                                                            <div className={item.seenByUser === false ? "notification-item-new" : "notification-item-seen"} onClick={() => { setSelectedNotificationObject(item); handleNotificationSelection(item); item.seenByUser = true; }}>
                                                                <div className="notification-item-info">
                                                                    <p>{item.seenByUser === false ? <b>NEW</b> : ""} {item.notificationMessage.length > 75 ? `${item.notificationMessage.slice(0, 75)}...` : item.notificationMessage}</p>
                                                                    <p>{new Date(item.date).toString().slice(0, 21)}</p>
                                                                </div>
                                                                <AiOutlineArrowRight color={"#404d72"}/>
                                                            </div>
                                                        )
                                                    } else return null;
                                                }) : null}
                                                <Link className="notification-item-seen" onClick={() => setShowNotifications(false)} to={linkObject}>
                                                    <div className="notification-item-info">
                                                        <p><b>See all notifications</b></p>
                                                    </div>
                                                    <AiOutlineArrowRight color={"#404d72"}/>
                                                </Link>
                                                <div className="profile-and-logout-container">
                                                        <Link 
                                                            to={"/my-profile"} 
                                                            className="nav-text-profile" 
                                                            onClick={() => {
                                                                localStorage.setItem('selectedPage', 'My Profile'); 
                                                                setSelectedPage("My Profile");
                                                                setShowNotifications(false)}}>
                                                            <h5>Go to My Profile</h5>
                                                        </Link>
                                                    <button 
                                                        className="nav-logout-btn" 
                                                        onClick={() => {
                                                            signOut(props.logOut); 
                                                            history.push("/")
                                                        }}>
                                                            <p>Log Out</p>
                                                        </button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                </IconContext.Provider>
            }
        </>
    )
}

export default Navbar;