import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { NavbarData } from './NavbarData';
import { IconContext } from 'react-icons';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import FantasyForecastLogo from '../../media/sd2.png';
import { AiOutlineArrowRight } from 'react-icons/ai';
import axios from 'axios';

function Navbar(props) {
    const [selectedPage, setSelectedPage] = useState("Home");
    const [width, setWidth] = useState(window.innerWidth > 1100);
    const [mobileWidth, setMobileWidth] = useState(window.innerWidth > 650);
    const [sidebar, setSidebar] = useState(false);
    const [profilePicture, setProfilePicture] = useState(props.profilePicture);
    const [showNotifications, setShowNotifications] = useState(false);
    const [numberOfNewNotis, setNumberOfNewNotis] = useState(0);
    const [linkObject, setLinkObject] = useState({
        pathname: "/notifications",
        userObj: props.userObj
    });
    // dummy data for now:
    const [nots, setNots] = useState([
        {
            notMsg: "Someone liked your news feed post!",
            date: "Today",
        },
        {
            notMsg: "You have been invited to join The Boys!",
            date: "Yesterday"
        }
    ]);
    const history = useHistory();

    const showSidebar = () => setSidebar(!sidebar);

    const updateWidth = () => {
        setWidth(window.innerWidth > 1350);
        setMobileWidth(window.innerWidth <= 650);
    };

    useEffect(() => {
        console.log(props);
        setProfilePicture(props.profilePicture);
        let numberOfNewNotifications = 0;
        if (props.userObj.notifications !== undefined) {
            for (let i = 0; i < props.userObj.notifications.length; i++) {
                // tally number of false seenByUsers here CHARMANDER
                if (props.userObj.notifications[i].seenByUser === false) {
                    numberOfNewNotifications = numberOfNewNotifications + 1;
                };
            };
            setNumberOfNewNotis(numberOfNewNotifications);
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

    /// copy-paste this into Notifications.js when updated
    const handleNotificationSelection = async (notification) => {
        // set seenByUser value to true
        let username = props.username === undefined ? props.userObj.username : props.username;
        // if (changeAll === true) {
        //     const res = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/editNotifications/${username}`, {
        //         setAllToTrue: true
        //     });
        //     setNumberOfNewNotis(0);
        //     console.log(res);
        //     return;
        // } else {
            if (notification.seenByUser === false) {
                // const res = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/editNotifications/${username}`, {
                const res = await axios.patch(`${process.env.REACT_APP_API_CALL_U}/editNotifications/${username}`, {
                    setAllToTrue: false,
                    notificationMessage: notification.notificationMessage,
                    notificationIndex: notification.notificationIndex
                });
                setNumberOfNewNotis(numberOfNewNotis-1);
                console.log(res);
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
            };
        // };
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
                            <img src={profilePicture} className="mobile-navbar-profile-pic" alt="User's profile pic" onClick={() => setShowNotifications(!showNotifications)}/>
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
                        {/* Might want to replace this div with a Link so we can pass in props like userObj / username to access notifications array */}
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
                        {/* <nav className="nav-menu"> */}
                            <div className="navbar">
                                <div className="navbar-grid">
                                    <img className="nav-logo" src={FantasyForecastLogo} alt="Fantasy Forecast Logo"/>
                                    {/* <h1 className="nav-bar-title">Fantasy Forecast <img src={FantasyForecastLogo} alt="Logo" width="15%"></img></h1> */}
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
                                                    } else return null;
                                                })}
                                            </ul>
                                            }
                                            {width === true &&
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
                                                                        <span className="nav-title">{item.title}</span>
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
                                                                        <span className="nav-title">{item.title}</span>
                                                                    </Link>
                                                                </li>
                                                            );
                                                        };
                                                    } else return null;
                                                })}
                                            </ul>
                                            }
                                    </div>
                                    <div className="user-logout-container">
                                        {/* <img src={props.profilePicture || localStorage.getItem("profilePicture")} className="navbar-profile-pic" alt="User's profile pic" /> */}
                                        <div className="image-and-noti-container">
                                            <img src={profilePicture} className="navbar-profile-pic" alt="User's profile pic" onClick={() => setShowNotifications(!showNotifications)}/>
                                            {numberOfNewNotis > 0 ? <h3 className="notification-counter" onClick={() => setShowNotifications(!showNotifications)}>{numberOfNewNotis}</h3> : null}
                                        </div>
                                        {/* <div className="user-logout-column-container">
                                            <p>
                                                <Link 
                                                    to={"/my-profile"} 
                                                    className="nav-text-profile" 
                                                    onClick={() => {
                                                        localStorage.setItem('selectedPage', 'My Profile'); 
                                                        setSelectedPage("My Profile")}}>
                                                    {props.username}
                                                </Link>
                                            </p>
                                            <button 
                                                className="nav-logout-btn" 
                                                onClick={() => {
                                                    signOut(props.logOut); 
                                                    history.push("/")
                                                }}>
                                                    Log Out
                                                </button>
                                        </div> */}
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
                                            {/* Might want to replace this div with a Link so we can pass in props like userObj / username to access notifications array */}
                                            <Link className="notification-item-seen" onClick={() => setShowNotifications(false)} to={linkObject}>
                                                <div className="notification-item-info">
                                                    <p><b>See all notifications</b></p>
                                                </div>
                                                <AiOutlineArrowRight color={"#404d72"}/>
                                            </Link>
                                            <div className="profile-and-logout-container">
                                                {/* <p className="nav-text-profile-link"> */}
                                                    <Link 
                                                        to={"/my-profile"} 
                                                        className="nav-text-profile" 
                                                        onClick={() => {
                                                            localStorage.setItem('selectedPage', 'My Profile'); 
                                                            setSelectedPage("My Profile");
                                                            setShowNotifications(false)}}>
                                                        <h5>Go to My Profile</h5>
                                                    </Link>
                                                {/* </p> */}
                                                <button 
                                                    className="nav-logout-btn" 
                                                    onClick={() => {
                                                        signOut(props.logOut); 
                                                        history.push("/")
                                                    }}>
                                                        <h4>Log Out</h4>
                                                    </button>
                                            </div>
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        {/* </nav> */}
                </IconContext.Provider>
            }
        </>
    )
}

export default Navbar;