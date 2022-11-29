import React from 'react';
import { Link } from 'react-router-dom';
import './HomeChangeLogPreview.css';

function HomeChangeLogPreview() {
    const changeLogArr = [
        `29.11.2022 Big wave of changes in the months since the summer. New additions include: Text to show unattempted forecasts, redesign of the My Forecasts page, including a new Forecast Chat, more info (i) buttons around the site to help explain features, a notifications menu (which can be accessed by clicking on your profile picture in the top right), trophies on the profile page and profile picture borders, brought back the Results tab on the forecast page for closed forecasts, and various styling elements throughout the site, amongst other features!`,
        `27.06.2022 Added extra support for the Articles tab on the My Forecasts page for the long-term problems so they should now perform more accurate searches based on the problem wording, previously they were searching for "UK Politics" as they didn't match previous criteria for the article scraper.`,
        `25.06.2022 Added ability to sort leaderboards by username, points, or AVG Brier Score by clicking the column name row. The Feedback page (found at the bottom of the Home page) also now shows the submitted feedback (still anonymously) and my response to them to hopefully help make the development process even more transparent.`,
        `24.06.2022 Added fix for the learn quizzes not accepting responses if the first attempt had the wrong number of answers (the first time is fine but subsequent attempts to submit with the right amount of responses were blocked improperly).`,
        `24.06.2022 Added password resetting on the login page, as well as more information for new users about what the site involves. Also added a fix for the Fantasy Forecast All-Time leaderboard as it wasn't updating the Average Brier Score column. Also reduced the requirement to see your stats from Level 10 to 6, as Onboarding tasks were changed recently and this reduced requirement reflects that.`,
        `23.06.2022 A fix has been implemented for the visualisation of single certainty problems (like BJ and KS resignation likelihoods) where it was only showing the forecast submitted last that day. The problematic code has been identified and fixed, meaning visualisation is as it should be.`,
        `22.06.2022 Most of the work now has been tweaking and refining. I've been working on the time/dates of forecasts, and making sure they all convert to the same timezone. This has been tricky and I think I know how I'll go about it differently next time. New users are also now auto-enrolled in the Practice and Real Tournaments, rather than needing to manually join themselves, the survey is live and available for all users, and extra handling has been added to the profile stats section of the page (simply putting N/A instead of a blank space when no forecast data is available). The next big thing I'm working on is an auto-email sender for resetting your password from the login page in case you forget it.`,
        `20.06.2022 Some behind the scenes code refactoring, rewriting and removal. Reduced count of server requests, which will hopefully make for a smoother user experience. Cleared change log of old updates, commence Change Log Season 2! Will try to write a bit more about changes so forecasters can have more insight rather than generic "fixed x, updated y".`,
        `12.06.2022 Updated login page, changed profile picture styling, added handling for news feed posts with erroneous links (if this happens, users can now add their own titles to the post instead), general styling and bug-fixing.`,
        `30.05.2022 Added a "Report Any Issues" page which can be accessed below the Change Log on the Home Screen - users can now submit comments anonymously on what they like or dislike, suggest new ideas, and report bugs/errors.`,
        // `26.05.2022 Added profile preview to the home page. Added levels and use FFPoints as XP. Added a tab to the Profile Page to showcase all rewards earnt and upcoming (currently under construction). Added Help Our Research tab to the Navbar, page currently under construction.`,
        // `17.05.2022 Added average player data to the My Stats charts on Profile pages, Search pages and the Home page preview.`,
        // `16.05.2022 Placed Articles tab under construction, also added leaderboard filtering by account type.`,
        // `10.05.2022 Added problem-specifc results tab. Go to My Forecasts > Select a problem from the dropdown and select the Results tab.`,
        // `03.05.2022 Updated the ClosedProblemModal (pop-up).`,
        // `28.03.2022 Updated code to be able to handle international user-based input.`,
        // `27.03.2022 Fixed code that was informing users they got a boost on their prediction no matter what. Fixed it to ensure it's just for 75 or above scores.`,
        // `22.03.2022 Added styling to the forecast analysis page so it is more responsive to screen sizes (smaller laptops and mobile specifically)`,
        // `21.03.2022 Added the ability to hover over any of a user's Last 5 Forecasts on the leaderboards to see the problem name.`,
        // `21.03.2022 Changed the boosting to individual scores from 5% for 2, 6% for 3, 7% for 4 and so on to just a flat 5% boost. This was done to keep the top performers still within touching distance, while still providing a good reward for performance. Infinite scaling might have become unreasonable.`,
        // `21.03.2022 Replaced the market name with just "Macron" when the "Articles" button is selected on the weekly problem. Using the market name was causing issues but just "Macron" is working`,
        // `15.03.2022 Added the change log!`,
        // `14.03.2022 Added a Forecast Analysis page. Now, when a problem closes, users have the ability to see more detailed feedback on their performance based on three dimensions of Reactiveness, Confidence and Timeliness. To see this, select any closed problem and then click the "Open Forecast Analysis Page" button.`,
        // `07.03.2022 Backend code fixes.`,
        // `04.03.2022 Created and added a new video explaining forecast scoring.`,
        // `28.02.2022 Comments made while forecasting are now visible by hovering over the data in the problem's Line Chart - they are still anonymous.`,
        // `18.02.2022 Scrapped the old Average Certainty calculator (which calculated and plotted the average of each day) and replaced it with a global average.`,
    ];

    return (
        <div className="home-button-small">
            <h2 className="home-button-small-title">Change Log & Dev Notes/Updates</h2>
            <div className="change-log-list">
                {changeLogArr.map((item, index) => {
                    if (index <= 4) {
                        if (item.length <= 70) {
                            return (
                                <span key={item} className="list-span">
                                    <h4 style={{ color: "#404d72"}}>{item.slice(0, 10)}</h4>
                                    <p>{item.slice(11, item.length)}</p>
                                </span>
                            )
                        } else return (
                            <span key={item} className="list-span">
                                <h4 style={{ color: "#404d72"}}>{item.slice(0, 10)}</h4>
                                <p>{item.slice(11, 70)}...</p>
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