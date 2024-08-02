import React from 'react';
import { Link } from 'react-router-dom';
import './HomeChangeLogPreview.css';

function HomeChangeLogPreview() {
    const changeLogArr = [
        `21.04.2023 After a brief hiatus, work has resumed on Fantasy Forecast. Every page has seen a redesign, slimming their widths to be more compact while reducing the amount of visual noise from sections standing out from others for a sleeker look. Font size across the site has decreased, the navbar at the top has also been redesigned to be more top-down, rather than the row of three components as it was before, helping decrease width used and making it more responsive to different screen sizes. The profile and search pages have been simplified, and the home page column on the right has been neatened.`,
        `29.11.2022 Big wave of changes in the months since the summer. New additions include: Text to show unattempted forecasts, redesign of the Forecasts page, including a new Forecast Chat, more info (i) buttons around the site to help explain features, a notifications menu (which can be accessed by clicking on Profile at the top of the screen your profile picture in the top right on a mobile device), trophies on the profile page and profile picture borders, brought back the Results tab on the forecast page for closed forecasts, and various styling elements throughout the site, amongst other features!`,
        `27.06.2022 Added extra support for the Articles tab on the Forecasts page for the long-term problems so they should now perform more accurate searches based on the problem wording, previously they were searching for "UK Politics" as they didn't match previous criteria for the article scraper.`,
        `25.06.2022 Added ability to sort leaderboards by username, points, or AVG Brier Score by clicking the column name row. The Feedback page (found at the bottom of the Home page) also now shows the submitted feedback (still anonymously) and my response to them to hopefully help make the development process even more transparent.`,
        `24.06.2022 Added fix for the learn quizzes not accepting responses if the first attempt had the wrong number of answers (the first time is fine but subsequent attempts to submit with the right amount of responses were blocked improperly).`,
        `24.06.2022 Added password resetting on the login page, as well as more information for new users about what the site involves. Also added a fix for the Fantasy Forecast All-Time leaderboard as it wasn't updating the Average Brier Score column. Also reduced the requirement to see your stats from Level 10 to 6, as Onboarding tasks were changed recently and this reduced requirement reflects that.`,
        `23.06.2022 A fix has been implemented for the visualisation of single certainty problems (like BJ and KS resignation likelihoods) where it was only showing the forecast submitted last that day. The problematic code has been identified and fixed, meaning visualisation is as it should be.`,
        `22.06.2022 Most of the work now has been tweaking and refining. I've been working on the time/dates of forecasts, and making sure they all convert to the same timezone. This has been tricky and I think I know how I'll go about it differently next time. New users are also now auto-enrolled in the Practice and Real Tournaments, rather than needing to manually join themselves, the survey is live and available for all users, and extra handling has been added to the profile stats section of the page (simply putting N/A instead of a blank space when no forecast data is available). The next big thing I'm working on is an auto-email sender for resetting your password from the login page in case you forget it.`,
        `20.06.2022 Some behind the scenes code refactoring, rewriting and removal. Reduced count of server requests, which will hopefully make for a smoother user experience. Cleared change log of old updates, commence Change Log Season 2! Will try to write a bit more about changes so forecasters can have more insight rather than generic "fixed x, updated y".`,
        `12.06.2022 Updated login page, changed profile picture styling, added handling for news feed posts with erroneous links (if this happens, users can now add their own titles to the post instead), general styling and bug-fixing.`,
        `30.05.2022 Added a "Report Any Issues" page which can be accessed below the Change Log on the Home Screen - users can now submit comments anonymously on what they like or dislike, suggest new ideas, and report bugs/errors.`,
    ];

    return (
        <div className="home-button-small">
            <h3 className="home-button-small-title">Site Updates</h3>
            <div className="change-log-list">
                {changeLogArr.map((item, index) => {
                    if (index <= 4) {
                        if (item.length <= 50) {
                            return (
                                <span key={item} className="list-span">
                                    <h5 style={{ color: "#404d72"}}>{item.slice(0, 10)}&nbsp;&nbsp;&nbsp;</h5>
                                    <h5>{item.slice(11, item.length)}</h5>
                                </span>
                            )
                        } else return (
                            <span key={item} className="list-span">
                                <h5 style={{ color: "#404d72"}}>{item.slice(0, 10)}&nbsp;&nbsp;&nbsp;</h5>
                                <h5>{item.slice(11, 60)}...</h5>
                            </span>
                        )
                    } else return null;
                })}
            </div>
            <Link 
                className="home-button-nav-button"
                to="/change-log">
                    See the full Change Log
            </Link>
        </div>
    )
}

export default HomeChangeLogPreview;