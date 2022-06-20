import React, { useState, useEffect } from 'react';
import './HelpOurResearchPage.css';

function HelpOurResearch(props) {
    const [submitMsg, setSubmitMsg] = useState("");

    useEffect(() => {
        // Query database or check user object and check if user has already completed the survey
        console.log(props);
        // if (props.userObject !== undefined) {
        //     if (props.userObject.completedSurvey === true) {}
        // }
    }, []);

    const handleSubmit = async () => {
        try {

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
                    in Politics, Swansea University). To be eligible for the tournament prizes <b>the survey must be completed before 11:59pm (BST) on Sunday 26th June 2022. If you haven't completed the survey before the deadline,
                    you will not be eligible for the prizes.</b> 
                </p>
                <br />
                <p>If you fill out the survey but change your mind as to being included in the study, please email <b>fantasyforecastcontact@gmail.com</b> and let us know. You will still be able to participate
                in the tournament as normal, but please be aware, however, that withdrawing from the survey will make you ineligible for the prizes.
                </p>
            </div>
            <h3>Survey:</h3>
            {(props.userObject !== undefined && props.userObject.completedSurvey === false) && 
                <form>

                </form>
            }
            {(props.userObject !== undefined && props.userObject.completedSurvey === true) && 
                <p>You have already completed the survey - thank you! As noted above, if you have changed your mind about study participation, please email <b>fantasyforecastcontact@gmail.com</b> and let us know :)</p>
            }
        </div>
    )
}

export default HelpOurResearch