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

function Navbar(props) {
    const [selectedPage, setSelectedPage] = useState("Home");
    const [width, setWidth] = useState(window.innerWidth > 1100);
    const [mobileWidth, setMobileWidth] = useState(window.innerWidth > 650);
    const [sidebar, setSidebar] = useState(false);
    const [profilePicture, setProfilePicture] = useState(props.profilePicture);
    const [showNotifications, setShowNotifications] = useState(false);
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

    // copy-paste this into Notifications.js when updated
    const handleNotificationSelection = (notification) => {
        // if it's problem related, go to forecasts page. Ideal would be it auto-selects from the dropdown for you
        if (notification.notificationSourcePath === "/forecast") {
            history.push("/forecast");
            return;
        // if it's post related, go to home page. Ideal would be it goes to individual news feed page with post already loaded
        } else if (notification.notificationSourcePath === "/news-post") {
            history.push("/home"); //replace this with news-post, not /home
            return;
        // if it's response to feedback, go to feedback page
        } else if (notification.notificationSourcePath === "/report-any-issues") {
            history.push("/report-any-issues");
            return;
        };
    };

    return (
        <>
            {mobileWidth === true &&
                <IconContext.Provider value={{ color: '#fff' }}>
                    <div className='mobile-navbar'>
                        <Link to='#' className='mobile-menu-bars'>
                            <FaIcons.FaBars onClick={showSidebar} />
                        </Link>
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
                                        onClick={() => { localStorage.setItem('selectedPage', item.title); setSelectedPage(item.title)}}>
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
                                        onClick={() => { localStorage.setItem('selectedPage', item.title); setSelectedPage(item.title)}}>
                                            <Link to={item.path}>
                                                {item.icon}
                                                <span className="mobile-nav-title">{item.title}</span>
                                            </Link>
                                    </li>
                                );
                            };
                    })}
                    <h4>5</h4>
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
                                                                onClick={() => { localStorage.setItem('selectedPage', item.title); setSelectedPage(item.title)}}>
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
                                                                onClick={() => { localStorage.setItem('selectedPage', item.title); setSelectedPage(item.title)}}>
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
                                                                    onClick={() => { localStorage.setItem('selectedPage', item.title); setSelectedPage(item.title)}}>
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
                                                                    onClick={() => { localStorage.setItem('selectedPage', item.title); setSelectedPage(item.title)}}>
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
                                        <img src={profilePicture} className="navbar-profile-pic" alt="User's profile pic" onClick={() => setShowNotifications(!showNotifications)}/>
                                        <div className="user-logout-column-container">
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
                                        </div>
                                        {showNotifications === true && 
                                        <div className="notification-dropdown">
                                            {/* each item to be message above date in left column, and right column to be an arrow icon pointing right */}
                                            {props.userObj.notifications !== undefined ? props.userObj.notifications.reverse().map((item, index) => {
                                                return (
                                                    <div className="notification-item" onClick={() => handleNotificationSelection(item)}>
                                                        <div className="notification-item-info">
                                                            <p>{item.notificationMessage}</p>
                                                            <p>{new Date(item.date).toString().slice(0, 21)}</p>
                                                        </div>
                                                        <AiOutlineArrowRight color={"#404d72"}/>
                                                    </div>
                                                )
                                            }) : null}
                                            {/* Might want to replace this div with a Link so we can pass in props like userObj / username to access notifications array */}
                                            <Link className="notification-item" onClick={() => setShowNotifications(false)} to={linkObject}>
                                                <div className="notification-item-info">
                                                    <p><b>See all notifications</b></p>
                                                </div>
                                                <AiOutlineArrowRight color={"#404d72"}/>
                                            </Link>
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