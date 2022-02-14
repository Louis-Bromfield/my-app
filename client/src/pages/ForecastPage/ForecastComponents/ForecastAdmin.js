import React, { useState, useEffect } from 'react';
import './ForecastAdmin.css';
import axios from 'axios';

function ForecastAdmin() {
    const [allForecasts, setAllForecasts] = useState([]);
    const [newProblemName, setNewProblemName] = useState("");
    const [allMarkets, setAllMarkets] = useState([]);
    const [openDate, setOpenDate] = useState();
    const [openTime, setOpenTime] = useState();
    const [closeDate, setCloseDate] = useState();
    const [closeTime, setCloseTime] = useState();
    const [market, setMarket] = useState("");
    const [formattedOpenDateTime, setFormattedOpenDateTime] = useState();
    const [formattedCloseDateTime, setFormattedCloseDateTime] = useState();
    const [formatOpenDate, setFormatOpenDate] = useState(false);
    const [formatCloseDate, setFormatCloseDate] = useState(false);
    const [happenedState, setHappenedState] = useState(false);
    const [notHappenedState, setNotHappenedState] = useState(false);
    const [happenedStateEarly, setHappenedStateEarly] = useState(false);
    const [notHappenedStateEarly, setNotHappenedStateEarly] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState("");
    const [problemSelectedText, setProblemSelectedText] = useState("");
    const [problemSelectedEarlyText, setProblemSelectedEarlyText] = useState("");
    const [problemSpotlightName, setProblemSpotlightName] = useState("");
    const [problemSpotlightStartDate, setProblemSpotlightStartDate] = useState("");
    const [problemSpotlightCloseDate, setProblemSpotlightCloseDate] = useState("");
    const [problemSpotlightMarket, setProblemSpotlightMarket] = useState("");
    const [problemSpotlightUniqueForecasterCount, setProblemSpotlightUniqueForecasterCount] = useState("");
    const [adminText, setAdminText] = useState("");
    const [problemNewCloseDate, setProblemNewCloseDate] = useState("");
    const [problemNewCloseTime, setProblemNewCloseTime] = useState("");
    const [newProblemCloseDateTime, setNewProblemCloseDateTime] = useState();
    const [isSingleCertainty, setIsSingleCertainty] = useState("");
    const [adminSingleCertainty, setAdminSingleCertainty] = useState();
    const [increasedState, setIncreasedState] = useState(false);
    const [stayedSameState, setStayedSameState] = useState(false);
    const [decreasedState, setDecreasedState] = useState(false);

    useEffect(() => {
        getAllForecastsFromDB();
        getAllMarketsFromDB();
        console.log("Forecast Admin UE");
    }, []);

    const getAllForecastsFromDB = async () => {
        try {
            const allForecastsDocument = await axios.get('https://fantasy-forecast-politics.herokuapp.com/forecasts');
            setAllForecasts(allForecastsDocument.data);
            setSelectedProblem(allForecastsDocument.data[0].problemName);
        } catch (error) {
            console.error("Error in ForecastAdmin > getAllForecastsFromDB");
            console.error(error);
        };
    };

    const getAllMarketsFromDB = async () => {
        try {
            const allMarketsDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/leaderboards/justNames/${localStorage.getItem("username")}`);
            let filteredbyIsFFOrNot = [];
            for (let i = 0; i < allMarketsDocument.data.length; i++) {
                if (allMarketsDocument.data[i][2] === true) {
                    filteredbyIsFFOrNot.push(allMarketsDocument.data[i]);
                };
            };
            setAllMarkets(filteredbyIsFFOrNot);
        } catch (error) {
            console.error("Error in ForecastAdmin > getAllMarketsFromDB");
            console.error(error);
        };
    };

    const persistNewProblemToDB = async (problemName, oDateTime, cDateTime, market, singleCertainty) => {
        if (/%/.test(problemName)) {
            setAdminText("Problem name contains a %, this is not allowed.")
            return;
        } else {
            setAdminText("");
            try {
                await axios.post('https://fantasy-forecast-politics.herokuapp.com/forecasts/newProblem', {
                    problemName: problemName,
                    startDate: oDateTime,
                    closeDate: cDateTime,
                    market: market,
                    singleCertainty: singleCertainty
                });
            } catch (error) {
                console.error("Error in ForecastAdmin > persistNewProblemToDB");
                console.error(error);
            };
        };
    };

    const formatDate = (type, date, time) => {
        const formattedDateTime = new Date(`${date.toString().slice(0, 15)} ${time.toString().slice(0, 5)}:00 GMT+0000 (Greenwich Mean Time)`).toString();
        if (type === "Open") {
            setFormattedOpenDateTime(formattedDateTime);
        } else if (type === "Close") {
            setFormattedCloseDateTime(formattedDateTime);
        };
        console.log(formattedDateTime);
    };

    const closeAndCalculateBriers = async (problemName, happenedStatus, notHappenedStatus, market, closeEarly) => {
        console.log("Here");
        try {
            // Brier Scores
            let scores;
            if (closeEarly === true) {
                console.log("Here2");
                scores = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/calculateBrier/${happenedStatus}/${market}/${closeEarly}`, {
                    problemName: problemName,
                    newProblemCloseDateTime: newProblemCloseDateTime
                });
            } else if (closeEarly === false) {
                console.log("Here3");
                scores = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/calculateBrier/${happenedStatus}/${market}/${closeEarly}`, {
                    problemName: problemName
                });
            };

            // Market Points
            const updatedMarket = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/leaderboards/closedProblem/${market}`, {
                scores: scores.data
            });
            console.log(updatedMarket.data);
        } catch (error) {
            console.error("Error in ForecastAdmin > persistNewProblemToDB");
            console.error(error);
        };
    };

    // Might be worth sorting backend before doing this!
    const closeAndCalculateBriersMultipleOutcomes = async (problemName, increasedStatus, stayedSameStatus, decreasedStatus, market, closeEarly) => {
        try {
            // works
            let outcome = increasedStatus === true ? "increase" : stayedSameStatus === true ? "same" : "decrease";
            console.log(outcome);

            // to find out
            let scores;
            if (closeEarly === true) {
                scores = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/calculateBriersMultipleOutcomes/${outcome}/${market}/${closeEarly}`, {
                    problemName: problemName,
                    newProblemCloseDateTime: newProblemCloseDateTime
                });
            } else if (closeEarly === false) {
                scores = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/calculateBriersMultipleOutcomes/${outcome}/${market}/${closeEarly}`, {
                    problemName: problemName
                });

            // Market Points
            const updatedMarket = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/leaderboards/closedProblem/${market}`, {
                scores: scores.data
            });
            console.log(updatedMarket.data);
        } catch (error) {
            console.error("Error in closeAndCalculateBriersMultipleOutcomes");
            console.error(error);
        };
    };

    const pullProblemDetailsForAdmin = (problemName) => {
        if (problemName === "Placeholder") {
            return;
        } else {
            const problem = allForecasts.find(el => el.problemName === problemName);
            setProblemSpotlightName(problem.problemName);
            setProblemSpotlightStartDate(problem.startDate);
            setProblemSpotlightCloseDate(problem.closeDate);
            setProblemSpotlightMarket(problem.market);
            setProblemSpotlightUniqueForecasterCount(problem.submittedForecasts.length);
            setAdminSingleCertainty(problem.singleCertainty);
        };
    };

    return (
        <div className="forecast-admin-container">
            <h2><u>Admin Controls</u></h2>
            <div className="row">
                <div className="close-forecast-container">
                    <h4>All problems in this dropdown require closing:</h4>
                    <select 
                        name="all-forecasts-dropdown" 
                        id="all-forecasts-dropdown" 
                        onChange={(e) => { 
                            setSelectedProblem(e.target.value); 
                            setProblemSelectedText(`You have selected: ${e.target.value}, are you sure?`);
                            pullProblemDetailsForAdmin(e.target.value);
                        }}
                    >
                        <option value={"Placeholder"}>Select from this dropdown:</option>
                        {/* map function for all forecasts */}
                        {allForecasts.map((item, index) => {
                            if (item.isClosed === false && new Date() > new Date(item.closeDate)) {
                                return (
                                    // NEED CLOSING
                                    <option 
                                        key={item._id} 
                                        value={item.problemName}>
                                            {item.problemName}
                                    </option>
                                )    
                            } else if (item.isClosed === true) {
                                // Already closed so don't need to show it
                                return null;
                            }
                            return null;
                        })}
                    </select>
                    <h3>{problemSelectedText}</h3>
                    {/* One outcome, so happened or didn't happen */}
                    {adminSingleCertainty === true &&
                        <div className="radio-responses">
                            <input 
                                type="radio" 
                                id={1} 
                                name="Happened" 
                                value={happenedState} 
                                checked={happenedState}
                                className="happened-btn"
                                onClick={() => setHappenedState(!happenedState)}
                            />
                            <label 
                                htmlFor="Happened" 
                                onClick={() => setHappenedState(!happenedState)}>
                                    Happened
                            </label>
                            <br />
                            <input 
                                type="radio" 
                                id={2} 
                                name="Didn't Happen" 
                                value={notHappenedState}
                                checked={notHappenedState} 
                                className="not-happened-btn" 
                                onClick={() => setNotHappenedState(!notHappenedState)} 
                            />
                            <label 
                                htmlFor="Didn't Happen" 
                                onClick={() => setNotHappenedState(!notHappenedState)}>
                                    Didn't Happen
                            </label>
                            <br />
                        </div>
                    }
                    {/* Three outcomes, so increased, stayed the same or decreased */}
                    {adminSingleCertainty === false &&
                        <div className="radio-responses">
                            <input 
                                type="radio" 
                                id={1} 
                                name="Increased" 
                                value={increasedState} 
                                checked={increasedState}
                                className="increased-btn"
                                onClick={() => setIncreasedState(!increasedState)}
                            />
                            <label 
                                htmlFor="Increased" 
                                onClick={() => setIncreasedState(!increasedState)}>
                                    Increased
                            </label>
                            <br />
                            <input 
                                type="radio" 
                                id={2} 
                                name="Stayed Same" 
                                value={stayedSameState}
                                checked={stayedSameState} 
                                className="stayed-same-btn" 
                                onClick={() => setStayedSameState(!stayedSameState)} 
                            />
                            <label 
                                htmlFor="Stayed Same" 
                                onClick={() => setStayedSameState(!stayedSameState)}>
                                    Stayed Same
                            </label>
                            <br />
                            <input 
                                type="radio" 
                                id={1} 
                                name="Decreased" 
                                value={decreasedState} 
                                checked={decreasedState}
                                className="decreased-btn"
                                onClick={() => setDecreasedState(!decreasedState)}
                            />
                            <label 
                                htmlFor="Decreased" 
                                onClick={() => setDecreasedState(!decreasedState)}>
                                    Increased
                            </label>
                        </div>
                    }
                    {adminSingleCertainty === true &&
                        <button 
                            className="forecast-admin-btn" 
                            onClick={() => { closeAndCalculateBriers(selectedProblem, happenedState, notHappenedState, problemSpotlightMarket, false); setAdminText("Problem Closed")}}>
                                Close Forecast & Calculate All Brier Scores
                        </button>
                    }
                    {adminSingleCertainty === false &&
                        <button 
                            className="forecast-admin-btn" 
                            onClick={() => { closeAndCalculateBriersMultipleOutcomes(selectedProblem, increasedState, stayedSameState, decreasedState, problemSpotlightMarket, false); setAdminText("Problem Closed")}}>
                                Close Forecast & Calculate All Brier Scores
                        </button>
                    }
                </div>
                <div className="selected-problem-spotlight">
                    <h3 style={{ color: "#404d72" }}><u>Selected Problem:</u></h3>
                    <h4>{problemSpotlightName}</h4>
                    <h3 style={{ color: "#404d72" }}><u>Start Date:</u></h3>
                    <h4>{problemSpotlightStartDate}</h4>
                    <h3 style={{ color: "#404d72" }}><u>Close Date:</u></h3>
                    <h4>{problemSpotlightCloseDate}</h4>
                    <h3 style={{ color: "#404d72" }}><u>Market:</u></h3>
                    <h4>{problemSpotlightMarket}</h4>
                    <h3 style={{ color: "#404d72" }}><u># Of Unique Forecasters:</u></h3>
                    <h4>{problemSpotlightUniqueForecasterCount}</h4>
                </div>
            </div>
            <br />
            {adminText !== "" && <h3>{adminText}</h3>}
            <hr />
            <div className="close-problem-early-container">
                <br />
                <h3>If you need to close the problem EARLY:</h3>
                <h4>All problems in this dropdown can be closed early:</h4>
                <select 
                    name="all-forecasts-dropdown" 
                    id="all-forecasts-dropdown" 
                    onChange={(e) => { 
                        setSelectedProblem(e.target.value); 
                        setProblemSelectedEarlyText(`You have selected: ${e.target.value}, are you sure?`);
                        pullProblemDetailsForAdmin(e.target.value);
                    }}
                >
                    <option value={"Placeholder"}>Select from this dropdown:</option>
                    {/* map function for all forecasts */}
                    {allForecasts.map((item, index) => {
                        if (item.isClosed === false) {
                            return (
                                // Can be closed
                                <option 
                                    key={item._id} 
                                    value={item.problemName}>
                                        {item.problemName}
                                </option>
                            )    
                        } else if (item.isClosed === true) {
                            // Already closed so don't need to show it
                            return null;
                        }
                        return null;
                    })}
                </select>
                <h3>{problemSelectedEarlyText}</h3>
                {adminSingleCertainty === true &&
                    <div className="radio-responses">
                        <input 
                            type="radio" 
                            id={1} 
                            name="Happened" 
                            value={happenedState} 
                            checked={happenedState}
                            className="happened-btn"
                            onClick={() => setHappenedState(!happenedState)}
                        />
                        <label 
                            htmlFor="Happened" 
                            onClick={() => setHappenedState(!happenedState)}>
                                Happened
                        </label>
                        <br />
                        <input 
                            type="radio" 
                            id={2} 
                            name="Didn't Happen" 
                            value={notHappenedState}
                            checked={notHappenedState} 
                            className="not-happened-btn" 
                            onClick={() => setNotHappenedState(!notHappenedState)} 
                        />
                        <label 
                            htmlFor="Didn't Happen" 
                            onClick={() => setNotHappenedState(!notHappenedState)}>
                                Didn't Happen
                        </label>
                        <br />
                    </div>
                }
                {/* Three outcomes, so increased, stayed the same or decreased */}
                {adminSingleCertainty === false &&
                    <div className="radio-responses">
                        <input 
                            type="radio" 
                            id={1} 
                            name="Increased" 
                            value={increasedState} 
                            checked={increasedState}
                            className="increased-btn"
                            onClick={() => { setIncreasedState(!increasedState); console.log(increasedState)}}
                        />
                        <label 
                            htmlFor="Increased" 
                            onClick={() => setIncreasedState(!increasedState)}>
                                Increased
                        </label>
                        <br />
                        <input 
                            type="radio" 
                            id={2} 
                            name="Stayed Same" 
                            value={stayedSameState}
                            checked={stayedSameState} 
                            className="stayed-same-btn" 
                            onClick={() => setStayedSameState(!stayedSameState)} 
                        />
                        <label 
                            htmlFor="Stayed Same" 
                            onClick={() => setStayedSameState(!stayedSameState)}>
                                Stayed Same
                        </label>
                        <br />
                        <input 
                            type="radio" 
                            id={1} 
                            name="Decreased" 
                            value={decreasedState} 
                            checked={decreasedState}
                            className="decreased-btn"
                            onClick={() => setDecreasedState(!decreasedState)}
                        />
                        <label 
                            htmlFor="Decreased" 
                            onClick={() => setDecreasedState(!decreasedState)}>
                                Decreased
                        </label>
                    </div>
                }
                <h4>Select the day the problem ended and the very second before it happened</h4>
                <h5>e.g. if Boris called an early election at midday on March 1st, set the time and date to March 1st 11:59:59</h5>
                <input 
                    type="date" 
                    onChange={(e) => setProblemNewCloseDate(e.target.value)}
                />
                <input 
                    type="time" 
                    onChange={(e) => setProblemNewCloseTime(e.target.value)}
                />
                <button 
                    className="forecast-admin-btn"
                    onClick={() => { 
                        console.log(problemNewCloseDate); 
                        console.log(problemNewCloseTime); 
                        console.log(new Date(`${problemNewCloseDate.toString().slice(0, 15)} ${problemNewCloseTime.toString().slice(0, 5)}:00 GMT+0000 (Greenwich Mean Time)`).toString())
                        setNewProblemCloseDateTime(new Date(`${problemNewCloseDate.toString().slice(0, 15)} ${problemNewCloseTime.toString().slice(0, 5)}:00 GMT+0000 (Greenwich Mean Time)`).toString())}}>
                            MUST CLICK: Format New Close Date Time
                </button>
                <br />
                {adminSingleCertainty === true &&
                    <button 
                        className="forecast-admin-btn"
                        onClick={() => { closeAndCalculateBriers(selectedProblem, happenedStateEarly, notHappenedStateEarly, problemSpotlightMarket, true); setAdminText("Problem Closed Early")}}>
                            Close SingleCert Problem Early & Calculate All Briers
                    </button>
                }
                {adminSingleCertainty === false &&
                    <button 
                        className="forecast-admin-btn" 
                        onClick={() => { closeAndCalculateBriersMultipleOutcomes(selectedProblem, increasedState, stayedSameState, decreasedState, problemSpotlightMarket, true); setAdminText("Problem Closed Early")}}>
                            Close MultiCert Problem & Calculate All Brier Scores
                    </button>
                }
                <br />
                <br />
            </div>
            <hr />
            <div className="create-forecast-container">
                <h3 className="forecast-admin-header">Create a new Forecast Problem:</h3>
                <input 
                    type="text" 
                    placeholder="Type new problem here"
                    onChange={(e) => setNewProblemName(e.target.value)}
                />
                <h3 className="forecast-admin-header">Forecast Open Date:</h3>
                <input 
                    type="date" 
                    onChange={(e) => { setOpenDate(e.target.value); setFormatOpenDate(false) }}
                />
                <input 
                    type="time" 
                    onChange={(e) => { setOpenTime(e.target.value); setFormatOpenDate(false) }}
                />
                <button 
                    className="forecast-admin-btn"
                    onClick={() => { formatDate("Open", openDate, openTime); setFormatOpenDate(true)}}>
                        MUST CLICK: Format Open Date Time
                </button>
                {formatOpenDate === true && <h4 style={{ color: "green" }}>Open Date Formatted Successfully: <u>{formattedOpenDateTime}</u></h4>}
                <h3 className="forecast-admin-header">Forecast Close Date:</h3>
                <input 
                    type="date" 
                    onChange={(e) => { setCloseDate(e.target.value); setFormatCloseDate(false)}}
                />
                <input 
                    type="time" 
                    onChange={(e) => { setCloseTime(e.target.value); setFormatCloseDate(false)}}
                />
                <button 
                    className="forecast-admin-btn" 
                    onClick={() => { formatDate("Close", closeDate, closeTime); setFormatCloseDate(true)}}>
                        MUST CLICK: Format Close Date Time
                </button>
                {formatCloseDate === true && <h4 style={{ color: "green" }}>Close Date Formatted Successfully: <u>{formattedCloseDateTime}</u></h4>}
                <h3 style={{ "color": "#404d72" }}>Set Is Forecast Single Certainty (True or False)</h3>
                <input type="text" onChange={(e) => { setIsSingleCertainty(e.target.value); console.log(e.target.value)}} />
                <h3 className="forecast-admin-header">Select which market this problem is available to:</h3>
                {allMarkets.map((market, index) => {
                    return (
                        <div key={index} className="market-checkbox">
                            <input type="checkbox" className="market-cb" onClick={() => setMarket(market[0])}/>
                            <h4>{market[0]}</h4>
                            <hr />
                        </div>
                    )
                })}
            </div>
            <button 
                className="forecast-admin-btn"
                onClick={() => persistNewProblemToDB(newProblemName, formattedOpenDateTime, formattedCloseDateTime, market, isSingleCertainty)}>
                    Persist New Forecast To DB
            </button>
        </div>
    )
}

export default ForecastAdmin;