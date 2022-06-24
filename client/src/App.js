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
import { useCookies } from 'react-cookie';

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
  const [cookie, setCookies] = useCookies(["username"]);

//   const updateUsername = async (newUsername) => {
//     await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`, { username: newUsername });
//     setUsername(newUsername);
//     localStorage.setItem("username", newUsername);
//   };

  const logOut = async () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', false);
    localStorage.removeItem('username');
    // await axios.delete(`https://fantasy-forecast-politics.herokuapp.com/deleteSession`);
    // localStorage.removeItem('name');
    // localStorage.removeItem('markets');
    // localStorage.removeItem('navigationOrder');
    // localStorage.removeItem('currentLeaderboardName');
    // localStorage.removeItem('userObj');
    // localStorage.removeItem('brierScore');
    // localStorage.removeItem('selectedPage');
    // localStorage.removeItem('profilePicture');
  };

  const login = async (username) => {
    console.log("In login function");
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

    // Add user to learnQuizzes - commented out as we move learnQuizzes to user documents
    // await axios.post(`https://fantasy-forecast-politics.herokuapp.com/learnQuizzes/`, { username: username });

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
    // localStorage.setItem('name', "XXXXXXXXXX");
    localStorage.setItem('markets', userObj.data[0].markets);
    // localStorage.setItem('userObj', userObj);
    // localStorage.setItem('profilePicture', userObj.data[0].profilePicture);
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
      setUsername(cookie.username);
      setUsername((localStorage.getItem("username") === undefined || localStorage.getItem("username") === null) ? cookie.username : localStorage.getItem("username"));
    //   setName(localStorage.getItem('name'));
    //   setMarkets(localStorage.getItem('markets'));
    //   setUserObject(localStorage.getItem('userObj'));
    //   setProfilePicture(localStorage.getItem('profilePicture'));
    //   if (isLoggedIn === true) {
        // do all db retrieval here? Or have one retrieval per page's root component
            // e.g. right now we have Home.js retrieving and passing stuff on, but we 
            // might be able to put it all inside this conditional and pass down from
            // here instead?

            // Might be able to avoid using localStorage then right? It's possible.
            // console.log(localStorage.getItem("username"));
            // console.log(cookie.username);
            console.log(localStorage.getItem("username"));
            console.log(cookie.username);
            pullAllInfoFromDBToPassDown(localStorage.getItem("username") === undefined || localStorage.getItem("username") === null ? cookie.username : localStorage.getItem("username"))
    //   };
  }, [isLoggedIn, cookie.username]);

  const pullAllInfoFromDBToPassDown = async (username) => {
      try {
          if (username === undefined) {
              return;
          };
          console.log(username);
          console.log("paIFDBTPDB");
        const userPulledFromDB = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`);  
        console.log(userPulledFromDB);

        setUserObject(userPulledFromDB.data[0]);
        setUsername(userPulledFromDB.data[0].username);
        setUserFFPoints(userPulledFromDB.data[0].fantasyForecastPoints);
        setMarkets(userPulledFromDB.data[0].markets);
        setProfilePicture(userPulledFromDB.data[0].profilePicture);
        setUserOnboarding(userPulledFromDB.data[0].onboarding);
        setUserClosedForecastCount(userPulledFromDB.data[0].numberOfClosedForecasts);
        setUserBrierScores(userPulledFromDB.data[0].brierScores);

        // console.log(userPulledFromDB.data[0].brierScores);

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
                {localStorage.setItem("selectedPage", "Home")}
            </Route>
            <Route exact path="/loginSuccess">
                <Redirect to="/home"></Redirect>
                {localStorage.setItem("selectedPage", "Home")}
            </Route>
            {/* <Route path='/home' render={(props) => <Home {...props} username={username} name={name} user={userObject} userBrierScores={userBrierScores} userClosedForecastCount={userClosedForecastCount} userOnboarding={userOnboarding} setUserObject={setUserObject} userMarkets={markets} userFFPoints={userFFPoints} setUserClosedForecastCount={setUserClosedForecastCount} />} /> */}
            <Route path='/home' render={(props) => <Home {...props} 
                username={username} 
                name={name} 
                user={userObject} 
                setUserObject={setUserObject} 
                userFFPoints={userFFPoints} 
                setProfilePicture={setProfilePicture} 
                profilePicture={profilePicture} 
                setUserFFPoints={setUserFFPoints}
            />} />
            <Route path="/change-log" render={(props) => <ChangeLog {...props} />} />
            <Route path="/news-post" render={(props) => <IndividualNewsFeedPost {...props} />} />
            <Route path='/forecast' render={(props) => <Forecast {...props} 
                markets={markets} 
                username={username} 
                userObject={userObject}
                userObjectMarkets={userObject.markets} 
                userBriers={userObject.brierScores}
            />} />
            <Route path='/forecast-analysis' render ={(props) => <ForecastAnalysisPage {...props} username={username} />} />
            <Route path='/leaderboard-select' render={(props) => <LeaderboardMenu {...props} 
                username={username} 
                markets={markets} 
                userFFPoints={userFFPoints} 
                userObject={userObject} 
                profilePicture={profilePicture} 
            />} />
            <Route path='/leaderboard' render={(props) => <IndividualLeaderboard {...props} 
                username={username} 
                markets={markets}
            />} />
            <Route path='/learn' render={(props) => <Learn {...props} username={username} isLoggedIn={isLoggedIn} />} />
            <Route path='/search' render={(props) => <Search {...props} username={username} />} />
            <Route path='/survey' render={(props) => <HelpOurResearch {...props} username={username} userObject={userObject} />}/>
            {/* <Route path='/my-profile' render={(props) => <Profile {...props} user={userObject} username={username} name={name} updateUsername={updateUsername} profilePicture={profilePicture}/>} /> */}
            <Route path='/my-profile' render={(props) => <Profile {...props} user={userObject} username={username} name={name} profilePicture={profilePicture}/>} />
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
            {/* if someone tries to access part of the site without being logged in: */}
            <Route exact path="/home">
                <Redirect to="/"></Redirect>
                {localStorage.setItem("selectedPage", "Home")}
            </Route>
            <Route exact path="/news-post">
                <Redirect to="/"></Redirect>
                {localStorage.setItem("selectedPage", "Home")}
            </Route>
            <Route exact path="/forecast">
                <Redirect to="/"></Redirect>
                {localStorage.setItem("selectedPage", "Home")}
            </Route>
            <Route exact path="/forecast-analysis">
                <Redirect to="/"></Redirect>
                {localStorage.setItem("selectedPage", "Home")}
            </Route>
            <Route exact path="/leaderboard-select">
                <Redirect to="/"></Redirect>
                {localStorage.setItem("selectedPage", "Home")}
            </Route>
            <Route exact path="/leaderboard">
                <Redirect to="/"></Redirect>
                {localStorage.setItem("selectedPage", "Home")}
            </Route>
            <Route exact path="/learn">
                <Redirect to="/"></Redirect>
                {localStorage.setItem("selectedPage", "Home")}
            </Route>
            <Route exact path="/search">
                <Redirect to="/"></Redirect>
                {localStorage.setItem("selectedPage", "Home")}
            </Route>
            <Route exact path="/survey">
                <Redirect to="/"></Redirect>
                {localStorage.setItem("selectedPage", "Home")}
            </Route>
            <Route exact path="/my-profile">
                <Redirect to="/"></Redirect>
                {localStorage.setItem("selectedPage", "Home")}
            </Route>
            <Route exact path="/report-any-issues">
                <Redirect to="/"></Redirect>
                {localStorage.setItem("selectedPage", "Home")}
            </Route>
          </Switch>
      </Router>
      }
    </div>
  );
}

export default App;
