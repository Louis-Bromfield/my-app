import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import Navbar from './components/Navbar/Navbar';
import ScrollToTop from './ScrollToTop';
import Home from './pages/HomePage/Home';
import IndividualNewsFeedPost from './pages/HomePage/HomeSectionButtons/IndividualNewsFeedPost';
import Forecast from './pages/ForecastPage/Forecast';
import LeaderboardMenu from './pages/LeaderboardPage/LeaderboardMenu';
import IndividualLeaderboard from './pages/LeaderboardPage/IndividualLeaderboard/IndividualLeaderboard';
import Learn from './pages/LearnPage/Learn';
import Search from './pages/SearchPage/Search';
import Profile from './pages/ProfilePage/Profile';
import Login from './pages/LoginPage/Login';
require('newrelic');

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [markets, setMarkets] = useState([]);
  const [userObject, setUserObject] = useState({});
  const [profilePicture, setProfilePicture] = useState("");

  const updateUsername = async (newUsername) => {
    await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`, { username: newUsername });
    setUsername(newUsername);
    localStorage.setItem("username", newUsername);
  };

  const logOut = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', false);
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    localStorage.removeItem('markets');
    localStorage.removeItem('navigationOrder');
    localStorage.removeItem('currentLeaderboardName');
    localStorage.removeItem('userObj');
    localStorage.removeItem('brierScore');
    localStorage.removeItem('selectedPage');
    localStorage.removeItem('profilePicture');
  };

  const login = (usernameFromLogin, nameFromLogin, marketsFromLogin, userObj, profilePicture) => {
    setUserObject(userObj);
    setUsername(usernameFromLogin);
    setName(nameFromLogin);
    setMarkets(marketsFromLogin);
    setProfilePicture(profilePicture);
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', true);
    localStorage.setItem('username', usernameFromLogin);
    localStorage.setItem('name', nameFromLogin);
    localStorage.setItem('markets', marketsFromLogin);
    localStorage.setItem('userObj', userObj);
    localStorage.setItem('profilePicture', profilePicture);
    localStorage.setItem('selectedPage', "Home");
  };

  useEffect(() => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
      setUsername(localStorage.getItem('username'));
      setName(localStorage.getItem('name'));
      setMarkets(localStorage.getItem('markets'));
      setUserObject(localStorage.getItem('userObj'));
      setProfilePicture(localStorage.getItem('profilePicture'));
  }, []);

  return (
    <div className="main-div">
      {isLoggedIn === true &&
        <Router>
          <ScrollToTop /> 
          <Navbar logOut={logOut} username={username} profilePicture={profilePicture} />
          <Switch>
            {/* <Route exact path='/' component={Home} /> */}
            {/* <Route path='/forecast' component={Forecast} /> */}
            {/* <Route path='/calibration' component={Calibration} /> */}
            {/* <Route path='/leaderboard-select' component={LeaderboardMenu} /> */}
            {/* <Route path='/leaderboard' component={IndividualLeaderboard} /> */}
            {/* <Route path='/learn' component={Learn} /> */}
            {/* <Route path='/my-profile' component={Profile} /> */}
            <Route exact path='/' render={(props) => <Home {...props} username={username} name={name} user={userObject} />} />
            <Route path="/news-post" render={(props) => <IndividualNewsFeedPost {...props} />} />
            <Route path='/forecast' render={(props) => <Forecast {...props} markets={markets} username={username} />} />
            <Route path='/leaderboard-select' render={(props) => <LeaderboardMenu {...props} username={username} />} />
            <Route path='/leaderboard' render={(props) => <IndividualLeaderboard {...props} username={username} />} />
            <Route path='/learn' render={(props) => <Learn {...props} username={username} isLoggedIn={isLoggedIn} />} />
            <Route path='/search' render={(props) => <Search {...props} />} />
            <Route exact path='/loaderio-3453265497ff3bf6dedab322adc3e24e/' render={(props) => <Home {...props} username={username} name={name} user={userObject} />} />
            <Route path='/my-profile' render={(props) => <Profile {...props} user={userObject} username={username} name={name} updateUsername={updateUsername} profilePicture={profilePicture}/>} />
          </Switch>
        </Router>
      }
      {isLoggedIn === false &&
        <Router>
          <ScrollToTop /> 
          <Switch>
            <Route exact path='/' render={(props) => <Login {...props} login={login}/>} />
          </Switch>
      </Router>
      }
    </div>
  );
}

export default App;
