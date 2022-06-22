import React, { useState, useEffect } from 'react';
import './HelpOurResearchPage.css';
import axios from 'axios';

function HelpOurResearch(props) {
    const [submitMsg, setSubmitMsg] = useState("");
    const [selfAssessedPolKnowledge, setSelfAssessedPolKnowledge] = useState("Very Knowledgeable");
    const [currentHomeSecretary, setCurrentHomeSecretary] = useState(null);
    const [currentDeputyPM, setCurrentDeputyPM] = useState(null);
    const [currentSOSHSC, setCurrentSOSHSC] = useState(null);
    const [currentSOSLUHC, setCurrentSOSLUHC] = useState(null);
    const [currentSOSScotland, setCurrentSOSScotland] = useState(null);
    const [currentLibDemLeader, setCurrentLibDemLeader] = useState(null);
    const [currentSNPHOCLeader, setCurrentSNPHOCLeader] = useState(null);
    const [currentShadowChanc, setCurrentShadowChanc] = useState(null);
    const [currentShadowSOST, setCurrentShadowSOST] = useState(null);
    const [currentSpeaker, setCurrentSpeaker] = useState(null);
    const [pollStationCloseTime, setPollStationCloseTime] = useState(null);
    const [dayOfPMQs, setDayOfPMQs] = useState(null);
    const [constituencyCount, setConstituencyCount] = useState(null);
    const [depositPay, setDepositPay] = useState(null);
    const [electoralSystemName, setElectoralSystemName] = useState(null);
    const [ethicsAdvisorNames, setEthicsAdvisorNames] = useState(null);
    const [inflationPercentage, setInflationPercentage] = useState(null);
    const [unemploymentPercentage, setUnemploymentPercentage] = useState(null);
    const [noConfidenceVoteCount, setNoConfidenceVoteCount] = useState(null);
    const [publicBillsName, setPublicBillsName] = useState(null);
    const [opposingArgumentConvince, setOpposingArgumentConvince] = useState("Strongly disagree");
    const [evidenceAgainstBeliefs, setEvidenceAgainstBeliefs] = useState("Strongly disagree");
    const [reviseBeliefs, setReviseBeliefs] = useState("Strongly disagree");
    const [changingYourMind, setChangingYourMind] = useState("Strongly disagree");
    const [intuitionIsBest, setIntuitionIsBest] = useState("Strongly disagree");
    const [perservereBeliefs, setPerservereBeliefs] = useState("Strongly disagree");
    const [disregardEvidence, setDisregardEvidence] = useState("Strongly disagree");
    const [foxHedgehogRating, setFoxHedgehogRating] = useState("Very much Fox-like");
    const [politicalInterest, setPoliticalInterest] = useState("Very interested");
    const [politicalSpectrumPosition, setPoliticalSpectrumPosition] = useState(0);
    const [ukPartySupporter, setUKPartySupporter] = useState("Yes");
    const [currentAge, setCurrentAge] = useState(null);
    const [identification, setIdentification] = useState("Male");
    const [highestQual, setHighestQual] = useState("No qualifications");
    const [householdIncome, setHouseholdIncome] = useState("Prefer not to say");
    const [ukBased, setUKBased] = useState("Yes");
    const [completedSurvey, setCompletedSurvey] = useState(false);

    useEffect(() => {
        // Query database or check user object and check if user has already completed the survey
        console.log(props);
        // if (props.userObject !== undefined) {
        //     if (props.userObject.completedSurvey === true) {
        //         setCompletedSurvey(true)
        //     } else {
        //         setCompletedSurvey(false);
        //     };
        // };
    }, [props]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // console.log(selfAssessedPolKnowledge);
            // console.log(currentHomeSecretary);
            // console.log(currentDeputyPM);
            // console.log(currentSOSHSC);
            // console.log(currentSOSLUHC);
            // console.log(currentSOSScotland);
            // console.log(currentLibDemLeader);
            // console.log(currentSNPHOCLeader);
            // console.log(currentShadowChanc);
            // console.log(currentShadowSOST);
            // console.log(currentSpeaker);
            // console.log(pollStationCloseTime);
            // console.log(typeof pollStationCloseTime);
            // console.log(dayOfPMQs);
            // console.log(constituencyCount);
            // console.log(depositPay);
            // console.log(electoralSystemName);
            // console.log(ethicsAdvisorNames);
            // console.log(inflationPercentage);
            // console.log(unemploymentPercentage);
            // console.log(noConfidenceVoteCount);
            // console.log(publicBillsName);
            // console.log(opposingArgumentConvince);
            // console.log(evidenceAgainstBeliefs);
            // console.log(reviseBeliefs);
            // console.log(changingYourMind);
            // console.log(intuitionIsBest);
            // console.log(perservereBeliefs);
            // console.log(disregardEvidence);
            // console.log(foxHedgehogRating);
            // console.log(politicalInterest);
            // console.log(politicalSpectrumPosition);
            // console.log(typeof politicalSpectrumPosition);
            // console.log(ukPartySupporter);
            // console.log(currentAge);
            // console.log(typeof currentAge);
            // console.log(identification);
            // console.log(highestQual);
            // console.log(householdIncome);
            // console.log(ukBased);

            const res = await axios.post(`https://fantasy-forecast-politics.herokuapp.com/users/surveyResponse`, {
                username: props.userObject.username,
                selfAssessedPolKnowledge: selfAssessedPolKnowledge,
                currentHomeSecretary: currentHomeSecretary,
                currentDeputyPM: currentDeputyPM,
                currentSOSHSC: currentSOSHSC,
                currentSOSLUHC: currentSOSLUHC,
                currentSOSScotland: currentSOSScotland,
                currentLibDemLeader: currentLibDemLeader,
                currentSNPHOCLeader: currentSNPHOCLeader,
                currentShadowChanc: currentShadowChanc,
                currentShadowSOST: currentShadowSOST,
                currentSpeaker: currentSpeaker,
                pollStationCloseTime: pollStationCloseTime,
                dayOfPMQs: dayOfPMQs,
                constituencyCount: constituencyCount,
                depositPay: depositPay,
                electoralSystemName: electoralSystemName,
                ethicsAdvisorNames: ethicsAdvisorNames,
                inflationPercentage: inflationPercentage,
                unemploymentPercentage: unemploymentPercentage,
                noConfidenceVoteCount: noConfidenceVoteCount,
                publicBillsName: publicBillsName,
                opposingArgumentConvince: opposingArgumentConvince,
                evidenceAgainstBeliefs: evidenceAgainstBeliefs,
                reviseBeliefs: reviseBeliefs,
                changingYourMind: changingYourMind,
                intuitionIsBest: intuitionIsBest,
                perservereBeliefs: perservereBeliefs,
                disregardEvidence: disregardEvidence,
                foxHedgehogRating: foxHedgehogRating,
                politicalInterest: politicalInterest,
                politicalSpectrumPosition: politicalSpectrumPosition,
                ukPartySupporter: ukPartySupporter,
                currentAge: currentAge,
                identification: identification,
                highestQual: highestQual,
                householdIncome: householdIncome,
                ukBased: ukBased,
            });
            if (res.data.surveySuccess === true) {
                setSubmitMsg("Your survey has been sent. Thank you for participating, and best of luck in the tournament!");
                const username = props.username === undefined ? props.userObject.username === undefined : props.username;
                console.log(username);
                const userRes = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`, {
                    completedSurvey: true
                });
                // if (userRes) {
                    console.log(userRes);
                // }
            };
        } catch (err) {
            console.error("Error in Survey > handleSubmit");
            console.error(err);
            setSubmitMsg("There was an error, please try again later.");
        };
    };

    return (
        <div className="help-our-research">
            <h1 className="help-our-research-header">Survey</h1>
            <div className="help-our-research-explainer">
                <p>Welcome to the survey. As a part of your time in our inaugural forecasting tournament, we ask that anyone wanting to compete for the Amazon prizes (totalling £500!) fills out the survey below. This information,
                    alongside the data generated from your time using this site, will be used in a research paper published by Dr Matthew Wall (Associate Professor of Politics, Swansea University) and Mr Louis Bromfield (PhD Student
                    in Politics, Swansea University). To be eligible for the tournament prizes <b>the survey must be completed before 11:59pm (BST) on Tuesday 28th June 2022. If you haven't completed the survey before the deadline,
                    you will not be eligible for the prizes.</b> 
                </p>
                <br />
                <p>Our focus in this work will be to look at the relationship between political knowledge and forecasting accuracy and, importantly, your answers to these questions don't bear on the tournament - so please answer honestly and don't worry if you don't know the answers to some of the questions (i.e., don't just look them up online!).</p>
                <br />
                <p>Please note that these data will be used for research purposes only and user anonymity will be maintained in any research publications.</p>
                <br />
                <h3 style={{ "color": "#404d72" }}>Withdrawal</h3>
                <p>If you fill out the survey but change your mind as to being included in the study, please email <b>fantasyforecastcontact@gmail.com</b> and let us know. You will still be able to participate
                in the tournament as normal, but please be aware, however, that withdrawing from the survey will make you ineligible for the prizes. You are also able to withdraw your data from our paper after
                the tournament has ended.
                </p>
            </div>
            {/* <h3 style={{ "color": "#404d72" }}>If you don't know the answer/what to write, please type "N/A".</h3> */}
            {/* <p>If you do not know the answer to any questions that require you to type out a response, please type "N/A".</p> */}
            {(props.userObject !== undefined && props.userObject.completedSurvey === false) && 
                <div className="form-container">
                    <h3 style={{ "color": "#404d72" }}>If you don't know the answer/what to write, please type "D/K".</h3>
                    <br />
                    <form className="survey-form">
                        <label htmlFor="question1-self-described-knowledge"><b>1. Which of the following do you feel best describes how knowledgeable you are about UK Politics?</b></label>
                        <select 
                            name="question1-self-described-knowledge" 
                                style={{ "padding": "0.5%" }}
                            id="question1-self-described-knowledge"
                            onChange={(e) => setSelfAssessedPolKnowledge(e.target.value)}
                        >
                            <option value="Very Knowledgeable">Very Knowledgeable</option>
                            <option value="Knowledgeable">Knowledgeable</option>
                            <option value="Somewhat Knowledgeable">Somewhat Knowledgeable</option>
                            <option value="Not Knowledgeable">Not Knowledgeable</option>
                        </select>
                        <br />
                        <label 
                            htmlFor="question2-home-secretary">
                                <b>2. Who is the current Home Secretary?</b>
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter your response here'
                            name="question2-home-secretary"
                                style={{ "padding": "0.5%" }}
                            onChange={(e) => setCurrentHomeSecretary(e.target.value)}/>
                        <br />
                        <label 
                            htmlFor="question3-deputy-pm">
                                <b>3. Who is the current Deputy Prime Minister?</b>
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter your response here'
                            name="question3-deputy-pm"
                                style={{ "padding": "0.5%" }}
                            onChange={(e) => setCurrentDeputyPM(e.target.value)}/>
                        <br />
                        <label 
                            htmlFor="question4-sos-health-and-social-care">
                                <b>4. Who is the current Secretary of State for Health and Social Care?</b>
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter your response here'
                            name="question4-sos-health-and-social-care"
                                style={{ "padding": "0.5%" }}
                            onChange={(e) => setCurrentSOSHSC(e.target.value)}/>
                        <br />
                        <label 
                            htmlFor="question5-sos-levellingup-housing-communities">
                                <b>5. Who is the current Secretary of State for Levelling Up, Housing and Communities?</b>
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter your response here'
                            name="question5-sos-levellingup-housing-communities"
                                style={{ "padding": "0.5%" }}
                            onChange={(e) => setCurrentSOSLUHC(e.target.value)}/>
                        <br />
                        <label 
                            htmlFor="question6-sos-scotland">
                                <b>6. Who is the current Secretary of State for Scotland?</b>
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter your response here'
                            name="question6-sos-scotland"
                                style={{ "padding": "0.5%" }}
                            onChange={(e) => setCurrentSOSScotland(e.target.value)}/>
                        <br />
                        <label 
                            htmlFor="question7-libdem-leader">
                                <b>7. Who is the current leader of the Liberal Democrats?</b>
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter your response here'
                            name="question7-libdem-leader"
                                style={{ "padding": "0.5%" }}
                            onChange={(e) => setCurrentLibDemLeader(e.target.value)}/>
                        <br />
                        <label 
                            htmlFor="question8-hoc-snp-leader">
                                <b>8. Who is the current Leader of the Scottish National Party (SNP) in the House of Commons?</b>
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter your response here'
                            name="question8-hoc-snp-leader"
                                style={{ "padding": "0.5%" }}
                            onChange={(e) => setCurrentSNPHOCLeader(e.target.value)}/>
                        <br />
                        <label 
                            htmlFor="question9-shadow-chancellor">
                                <b>9. Who is the current Shadow Chancellor of the Exchequer?</b>
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter your response here'
                            name="question9-shadow-chancellor"
                                style={{ "padding": "0.5%" }}
                            onChange={(e) => setCurrentShadowChanc(e.target.value)}/>
                        <br />
                        <label 
                            htmlFor="question10-sos-transport">
                                <b>10. Who is the current Shadow Secretary of State for Transport?</b>
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter your response here'
                            name="question10-sos-transport"
                                style={{ "padding": "0.5%" }}
                            onChange={(e) => setCurrentShadowSOST(e.target.value)}/>
                        <br />
                        <label 
                            htmlFor="question11-hoc-speaker">
                                <b>11. Who is the current Speaker of the House of Commons?</b>
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter your response here'
                            name="question11-hoc-speaker"
                                style={{ "padding": "0.5%" }}
                            onChange={(e) => setCurrentSpeaker(e.target.value)}/>
                        <br />
                        <label 
                            htmlFor="">
                                <b>12. At what time (e.g. 11:00am, 3:45pm) do Polling stations in the UK normally close on election day?</b>
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter your response here'
                            name="question12-polling-stations-close-time"
                                style={{ "padding": "0.5%" }}
                            onChange={(e) => setPollStationCloseTime(e.target.value)}/>
                        <br />
                        <label 
                            htmlFor="">
                                <b>13. On what day of the week does Prime Minister’s Questions usually take place?</b>
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter your response here'
                            name="question13-pmqs-day"
                                style={{ "padding": "0.5%" }}
                            onChange={(e) => setDayOfPMQs(e.target.value)}/>
                        <br />
                        <label 
                            htmlFor="">
                                <b>14. How many parliamentary constituencies are there in the UK?</b>
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter your response here'
                            name="question14-constituency-count"
                                style={{ "padding": "0.5%" }}
                            onChange={(e) => setConstituencyCount(e.target.value)}/>
                        <br />
                        <label 
                            htmlFor="">
                                <b>15. What amount of money do candidates in UK parliamentary elections have to pay as a deposit?</b>
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter your response here'
                            name="question15-deposit-amount"
                                style={{ "padding": "0.5%" }}
                            onChange={(e) => setDepositPay(e.target.value)}/>
                        <br />
                        <label 
                            htmlFor="">
                                <b>16. In 2011, the UK held a referendum on changing its parliamentary electoral system from first-past-the-post, what was the name of the proposed electoral system that would have replaced it?</b>
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter your response here'
                            name="question16-electoral-system-name"
                                style={{ "padding": "0.5%" }}
                            onChange={(e) => setElectoralSystemName(e.target.value)}/>
                        <br />
                        <label 
                            htmlFor="">
                                <b>17. Two ethics advisors to Boris Johnson have resigned since he became prime minister, what are their names?</b>
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter your response here'
                            name="question17-ethics-advisor-names"
                                style={{ "padding": "0.5%" }}
                            onChange={(e) => setEthicsAdvisorNames(e.target.value)}/>
                        <br />
                        <label 
                            htmlFor="">
                                <b>18. What % inflation was calculated by the Office for National Statistics in the 12 months up to April, 2022 (note, we’re looking for the Consumer Prices Index (CPI) figure).</b>
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter your response here'
                            name="question18-oni-inflation"
                                style={{ "padding": "0.5%" }}
                            onChange={(e) => setInflationPercentage(e.target.value)}/>
                        <br />
                        <label 
                            htmlFor="">
                                <b>19. What was the latest % unemployment rate calculated by the Office for National Statistics in the UK?</b>
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter your response here'
                            name="question19-unemployment-rate"
                                style={{ "padding": "0.5%" }}
                            onChange={(e) => setUnemploymentPercentage(e.target.value)}/>
                        <br />
                        <label 
                            htmlFor="">
                                <b>20. On June 6th, 2022, how many Conservative Party MPs voted no confidence in Boris Johnson?</b>
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter your response here'
                            name="question20-vonc-against"
                                style={{ "padding": "0.5%" }}
                            onChange={(e) => setNoConfidenceVoteCount(e.target.value)}/>
                        <br />
                        <label 
                            htmlFor="">
                                <b>21. What is the name for public bills introduced in the UK parliament by MPs and Lords who are not government ministers?</b>
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter your response here'
                            name="question21-bill-name"
                                style={{ "padding": "0.5%" }}
                            onChange={(e) => setPublicBillsName(e.target.value)}/>
                        <br />
                        <p>
                            <b>22. Please rate your agreement or disagreement with the following statements (Strongly Disagree, Disagree, Neither Agree Nor Disagree, Agree, Strongly Agree)</b>
                        </p>
                        <br />
                        <label htmlFor="question23-agreement1"><b>22a. Allowing oneself to be convinced by an opposing argument is a sign of good character.</b></label>
                        <select name="question23-agreement1" id="question23-agreement1"
                            style={{ "padding": "0.5%" }}
                            onChange={(e) => setOpposingArgumentConvince(e.target.value)}>
                            <option value="Strongly Disagree">Strongly Disagree</option>
                            <option value="Disagree">Disagree</option>
                            <option value="Neither Agree Nor Disagree">Neither Agree Nor Disagree</option>
                            <option value="Agree">Agree</option>
                            <option value="Strongly Agree">Strongly Agree</option>
                        </select>
                        <br />
                        <label htmlFor="question24-agreement2"><b>22b. People should take into consideration evidence that goes against their beliefs.</b></label>
                        <select name="question24-agreement2" id="question24-agreement2"
                            style={{ "padding": "0.5%" }}
                            onChange={(e) => setEvidenceAgainstBeliefs(e.target.value)}>
                            <option value="Strongly Disagree">Strongly Disagree</option>
                            <option value="Disagree">Disagree</option>
                            <option value="Neither Agree Nor Disagree">Neither Agree Nor Disagree</option>
                            <option value="Agree">Agree</option>
                            <option value="Strongly Agree">Strongly Agree</option>
                        </select>
                        <br />
                        <label htmlFor="question25-agreement3"><b>22c. People should revise their beliefs in response to new information or evidence.</b></label>
                        <select name="question25-agreement3" id="question25-agreement3"
                            style={{ "padding": "0.5%" }}
                            onChange={(e) => setReviseBeliefs(e.target.value)}>
                            <option value="Strongly Disagree">Strongly Disagree</option>
                            <option value="Disagree">Disagree</option>
                            <option value="Neither Agree Nor Disagree">Neither Agree Nor Disagree</option>
                            <option value="Agree">Agree</option>
                            <option value="Strongly Agree">Strongly Agree</option>
                        </select>
                        <br />
                        <label htmlFor="question26-agreement4"><b>22d. Changing your mind is a sign of weakness.</b></label>
                        <select name="question26-agreement4" id="question26-agreement4"
                            style={{ "padding": "0.5%" }}
                            onChange={(e) => setChangingYourMind(e.target.value)}>
                            <option value="Strongly Disagree">Strongly Disagree</option>
                            <option value="Disagree">Disagree</option>
                            <option value="Neither Agree Nor Disagree">Neither Agree Nor Disagree</option>
                            <option value="Agree">Agree</option>
                            <option value="Strongly Agree">Strongly Agree</option>
                        </select>
                        <br />
                        <label htmlFor="question27-agreement5"><b>22e. Intuition is the best guide in making decisions.</b></label>
                        <select name="question27-agreement5" id="question27-agreement5"
                            style={{ "padding": "0.5%" }}
                            onChange={(e) => setIntuitionIsBest(e.target.value)}>
                            <option value="Strongly Disagree">Strongly Disagree</option>
                            <option value="Disagree">Disagree</option>
                            <option value="Neither Agree Nor Disagree">Neither Agree Nor Disagree</option>
                            <option value="Agree">Agree</option>
                            <option value="Strongly Agree">Strongly Agree</option>
                        </select>
                        <br />
                        <label htmlFor="question28-agreement6"><b>22f. It is important to persevere in your beliefs even when evidence is brought to bear against them.</b></label>
                        <select name="question28-agreement6" id="question28-agreement6"
                            style={{ "padding": "0.5%" }}
                            onChange={(e) => setPerservereBeliefs(e.target.value)}>
                            <option value="Strongly Disagree">Strongly Disagree</option>
                            <option value="Disagree">Disagree</option>
                            <option value="Neither Agree Nor Disagree">Neither Agree Nor Disagree</option>
                            <option value="Agree">Agree</option>
                            <option value="Strongly Agree">Strongly Agree</option>
                        </select>
                        <br />
                        <label htmlFor="question29-agreement7"><b>22g. One should disregard evidence that conflicts with one’s established beliefs.</b></label>
                        <select name="question29-agreement7" id="question29-agreement7"
                            style={{ "padding": "0.5%" }}
                            onChange={(e) => setDisregardEvidence(e.target.value)}>
                            <option value="Strongly Disagree">Strongly Disagree</option>
                            <option value="Disagree">Disagree</option>
                            <option value="Neither Agree Nor Disagree">Neither Agree Nor Disagree</option>
                            <option value="Agree">Agree</option>
                            <option value="Strongly Agree">Strongly Agree</option>
                        </select>
                        <br />
                        <label htmlFor="question30-fox-hedgehog"><b>23. In a famous essay, Isaiah Berlin classified thinkers as hedgehogs and foxes: The hedgehog knows one big thing and tries to explain as much as possible using that theory or framework. The fox knows many small things and is content to improvise explanations on a case by-case basis. When it comes to making predictions, would you describe yourself as more of a hedgehog or more of a fox?</b></label>
                        <select name="question30-fox-hedgehog" id="question30-fox-hedgehog"
                            style={{ "padding": "0.5%" }}
                            onChange={(e) => setFoxHedgehogRating(e.target.value)}>
                            <option value="Very much Fox-like">Very much Fox-like</option>
                            <option value="Somewhat Fox-like">Somewhat Fox-like</option>
                            <option value="Neither Fox nor Hedgehog-like">Neither Fox nor Hedgehog-like</option>
                            <option value="Hedgehog-like">Hedgehog-like</option>
                            <option value="Somewhat Hedgehog-like">Somewhat Hedgehog-like</option>
                            <option value="Very much Hedgehog-like">Very much Hedgehog-like</option>
                        </select>
                        <br />
                        <label htmlFor="question30-political-interest"><b>24. How interested would you say you are in politics?</b></label>
                        <select name="question30-political-interest" id="question30-political-interest"
                            style={{ "padding": "0.5%" }}
                            onChange={(e) => setPoliticalInterest(e.target.value)}>
                            <option value="Very interested">Very interested</option>
                            <option value="Fairly interested">Fairly interested</option>
                            <option value="Not very interested">Not very interested</option>
                            <option value="Not at all interested">Not at all interested</option>
                        </select>
                        <br />
                        <label htmlFor="question31-partisan-spectrum-placement"><b>25. In politics people sometimes talk of left and right. Where would you place yourself on the following scale?</b></label>
                        <select name="question31-partisan-spectrum-placement" id="question31-partisan-spectrum-placement"
                            style={{ "padding": "0.5%" }}
                            onChange={(e) => setPoliticalSpectrumPosition(e.target.value)}>
                            <optgroup label="Left">Left</optgroup>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <optgroup label="Right"></optgroup>
                        </select>
                        <br />
                        <label htmlFor="question32-party-support"><b>26. Do you consider yourself a supporter of any of the parties in the UK?</b></label>
                        <select name="question32-party-support" id="question32-party-support"
                            style={{ "padding": "0.5%" }}
                            onChange={(e) => setUKPartySupporter(e.target.value)}>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            <option value="I don't know">I don't know</option>
                        </select>
                        <br />
                        <label htmlFor="question32-age"><b>27. What is your current age?</b></label>
                        <input type="number" 
                            style={{ "padding": "0.5%" }}onChange={(e) => setCurrentAge(e.target.value)}/>
                        <br />
                        <label htmlFor="question33-identification"><b>28. Which of the following describes how you think of yourself?</b></label>
                        <select name="question33-identification" id="question33-identification"
                            style={{ "padding": "0.5%" }}
                            onChange={(e) => setIdentification(e.target.value)}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="In another way">In another way</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                        <br />
                        <label htmlFor="question34-qualifications"><b>29. What is the highest qualification you have? Please take your answer from this list.</b></label>
                        <select name="question34-qualifications" id="question34-qualifications"
                            style={{ "padding": "0.5%" }}
                            onChange={(e) => setHighestQual(e.target.value)}>
                            <option value="No qualifications">No qualifications</option>
                            <option value="Below GCSE">Below GCSE</option>
                            <option value="A-Level">A-Level</option>
                            <option value="Undergraduate degree">Undergraduate degree</option>
                            <option value="Postgraduate degree">Postgraduate degree</option>
                            <option value="Clerical and commercial qualifications">Clerical and commercial qualifications</option>
                            <option value="Recognised trade apprenticeships">Recognised trade apprenticeships</option>
                            <option value="Other technical, professional or higher qualification">Other technical, professional or higher qualification</option>
                        </select>
                        <br />
                        <label htmlFor="question35-household-income"><b>30. Which of following ranges represents the total annual income of your household from all sources before tax - including benefits, savings and so on?</b></label>
                        <select name="question35-household-income" id="question35-household-income"
                            style={{ "padding": "0.5%" }}
                            onChange={(e) => setHouseholdIncome(e.target.value)}>
                            <option value="Prefer not to say">Prefer not to say</option>
                            <option value="Don't know">Don't know</option>
                            <option value="Under £5,200">Under £5,200</option>
                            <option value="£5,200 - £15,599">£5,200 - £15,599</option>
                            <option value="£15,600 - £25,999">£15,600 - £25,999</option>
                            <option value="£26,000 - £36,399">£26,000 - £36,399</option>
                            <option value="£35,400 - £46,799">£35,400 - £46,799</option>
                            <option value="£46,800 - £74,999">£46,800 - £74,999</option>
                            <option value="£75,000 - £149,999">£75,000 - £149,999</option>
                            <option value="£150,000 or more">£150,000 or more</option>
                        </select>
                        <br />
                        <label htmlFor="question36-uk-based"><b>31. Are you currently based in the UK?.</b></label>
                        <select name="question36-uk-based" id="question36-uk-based"
                            style={{ "padding": "0.5%" }}
                            onChange={(e) => setUKBased(e.target.value)}>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        <br />
                        <p>Double check all of your answers before submitting, you only get to do this once!</p>
                        <br />
                        {(props.userObject === undefined || submitMsg === "") && 
                        <button className="submit-survey-btn" onClick={(e) => handleSubmit(e)}>Submit</button>
                        }
                    </form>
                </div>
            }
            {/* {submitMsg !== "" && submitMsg} */}
            {((props.userObject !== undefined && props.userObject.completedSurvey === true) || submitMsg !== "") && 
                <p>Your survey has been sent. Thank you for participating, and best of luck in the tournament! As noted above, if you have changed your mind about study participation and wish to be withdrawn, please email <b>fantasyforecastcontact@gmail.com</b> and let us know :) You will still be able to participate in the tournament, you just won't be eligible for the prizes anymore.</p>
            }
        </div>
    )
}

export default HelpOurResearch