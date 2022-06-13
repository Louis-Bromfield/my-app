import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import Navbar from './components/Navbar/Navbar';
import ScrollToTop from './ScrollToTop';
import Home from './pages/HomePage/Home';
import ChangeLog from './pages/ChangeLogPage/ChangeLog';
import IndividualNewsFeedPost from './pages/HomePage/HomeSectionButtons/IndividualNewsFeedPost';
import Forecast from './pages/ForecastPage/Forecast';
import ForecastAnalysisPage from './pages/ForecastAnalysisPage/ForecastAnalysisPage';
import LeaderboardMenu from './pages/LeaderboardPage/LeaderboardMenu';
import IndividualLeaderboard from './pages/LeaderboardPage/IndividualLeaderboard/IndividualLeaderboard';
import Learn from './pages/LearnPage/Learn';
import Search from './pages/SearchPage/Search';
import Profile from './pages/ProfilePage/Profile';
import Login from './pages/LoginPage/Login';
import LoginSuccess from './pages/LoginSuccessPage/LoginSuccess';
import HelpOurResearch from './pages/HelpOurResearchPage/HelpOurResearch';
import ReportAnyIssues from './pages/ReportAnyIssuesPage/ReportAnyIssues';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userForLogin, setUserForLogin] = useState("");
  const [name, setName] = useState("");
  const [markets, setMarkets] = useState([]);
  const [userObject, setUserObject] = useState({});
  const [profilePicture, setProfilePicture] = useState("");
  const [userFFPoints, setUserFFPoints] = useState();
  const [userOnboarding, setUserOnboarding] = useState({});
  const [userClosedForecastCount, setUserClosedForecastCount] = useState(0);
  const [userBrierScores, setUserBrierScores] = useState([]);

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

  const login = async (username) => {
    console.log("In login function");
    console.log("Finding a user with this username: " + username);
    const userObj = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`);
    if (userObj.data.length === 0) {
        return;
    };
    // Add user to leaderboard
    const ffAllTime = "Fantasy Forecast All-Time";
    await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/leaderboards/${ffAllTime}`, {
        username: username,
        isGroup: false,
        profilePicture: userObj.data[0].profilePicture
    });

    // Add user to learnQuizzes
    await axios.post(`https://fantasy-forecast-politics.herokuapp.com/learnQuizzes/`, { username: username });

    console.log(userObj);
    setUserObject(userObj.data[0]);
    setUsername(userObj.data[0].username);
    setUserFFPoints(userObj.data[0].fantasyForecastPoints);
    setName("XXXXXXXXXX");
    setMarkets(userObj.data[0].markets);
    setProfilePicture(userObj.data[0].profilePicture);
    localStorage.setItem('isLoggedIn', true);
    localStorage.setItem("firstVisit", true);
    localStorage.setItem('username', userObj.data[0].username);
    localStorage.setItem('name', "XXXXXXXXXX");
    localStorage.setItem('markets', userObj.data[0].markets);
    localStorage.setItem('userObj', userObj);
    localStorage.setItem('profilePicture', userObj.data[0].profilePicture);
    localStorage.setItem('selectedPage', "Home");
    // setUserObject(userObj);
    // setUsername(usernameFromLogin);
    // setName(nameFromLogin);
    // setMarkets(marketsFromLogin);
    // setProfilePicture(profilePicture);
    // setIsLoggedIn(true);
    // localStorage.setItem('isLoggedIn', true);
    // localStorage.setItem('username', usernameFromLogin);
    // localStorage.setItem('name', nameFromLogin);
    // localStorage.setItem('markets', marketsFromLogin);
    // localStorage.setItem('userObj', userObj);
    // localStorage.setItem('profilePicture', profilePicture);
    // localStorage.setItem('selectedPage', "Home");
    setIsLoggedIn(true);
};

  useEffect(() => {
      console.log("A UE");
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
      setUsername(localStorage.getItem('username'));
      setName(localStorage.getItem('name'));
      setMarkets(localStorage.getItem('markets'));
      setUserObject(localStorage.getItem('userObj'));
      setProfilePicture(localStorage.getItem('profilePicture'));
      if (isLoggedIn === true) {
        // do all db retrieval here? Or have one retrieval per page's root component
            // e.g. right now we have Home.js retrieving and passing stuff on, but we 
            // might be able to put it all inside this conditional and pass down from
            // here instead?

            // Might be able to avoid using localStorage then right? It's possible.
            pullAllInfoFromDBToPassDown(username)
      };
  }, [isLoggedIn, username]);

  const pullAllInfoFromDBToPassDown = async (username) => {
      try {
        const userPulledFromDB = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`);  
        console.log(userPulledFromDB);
        // ----------------
        // Add in JWT verification here? That way if someone changes their username in localstorage, we do a check
        // to see if their JWT matches the one stored in the database and if it fails just return here and don't
        // grab any more, that would leave it as ok for their username to be in LS and this function to work, I think

        // ----------------
        setUserObject(userPulledFromDB.data[0]);
        setUsername(userPulledFromDB.data[0].username);
        setUserFFPoints(userPulledFromDB.data[0].fantasyForecastPoints);
        setMarkets(userPulledFromDB.data[0].markets);
        setProfilePicture(userPulledFromDB.data[0].profilePicture);
        setUserOnboarding(userPulledFromDB.data[0].onboarding);
        setUserClosedForecastCount(userPulledFromDB.data[0].numberOfClosedForecasts);
        setUserBrierScores(userPulledFromDB.data[0].brierScores);

      } catch(error) {
          console.error("Error in pAIFDBTPD");
          console.error(error);
      };
  };

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
            <Route exact path="/">
                <Redirect to="/home"></Redirect>
            </Route>
            <Route exact path="/loginSuccess">
                <Redirect to="/home"></Redirect>
            </Route>
            <Route path='/home' render={(props) => <Home {...props} username={username} name={name} user={userObject} userBrierScores={userBrierScores} userClosedForecastCount={userClosedForecastCount} userOnboarding={userOnboarding} setUserObject={setUserObject} userMarkets={markets} userFFPoints={userFFPoints} />} />
            <Route path="/change-log" render={(props) => <ChangeLog {...props} />} />
            <Route path="/news-post" render={(props) => <IndividualNewsFeedPost {...props} />} />
            <Route path='/forecast' render={(props) => <Forecast {...props} markets={markets} username={username} />} />
            <Route path='/forecast-analysis' render ={(props) => <ForecastAnalysisPage {...props} username={username} />} />
            <Route path='/leaderboard-select' render={(props) => <LeaderboardMenu {...props} username={username} userFFPoints={userFFPoints} />} />
            <Route path='/leaderboard' render={(props) => <IndividualLeaderboard {...props} username={username} />} />
            <Route path='/learn' render={(props) => <Learn {...props} username={username} isLoggedIn={isLoggedIn} />} />
            <Route path='/search' render={(props) => <Search {...props} username={username} />} />
            <Route path='/survey' render={(props) => <HelpOurResearch {...props} />}/>
            <Route path='/my-profile' render={(props) => <Profile {...props} user={userObject} username={username} name={name} updateUsername={updateUsername} profilePicture={profilePicture}/>} />
            <Route path='/report-any-issues' render={(props) => <ReportAnyIssues {...props} />} />
          </Switch>
        </Router>
      }
      {isLoggedIn === false &&
        <Router>
          <ScrollToTop /> 
          <Switch>
            <Route exact path='/' render={(props) => <Login {...props} login={login} setUserForLogin={setUserForLogin} setIsLoggedIn={setIsLoggedIn} setUserObject={setUserObject} setUsername={setUsername} setUserFFPoints={setUserFFPoints} setName={setName} setMarkets={setMarkets} setProfilePicture={setProfilePicture} />} />
            <Route path='/loginSuccess' render={(props) => <LoginSuccess {...props} login={login} setUserForLogin={setUserForLogin} setIsLoggedIn={setIsLoggedIn} />} />
          </Switch>
      </Router>
      }
    </div>
  );
}

export default App;
