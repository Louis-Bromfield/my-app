import React from 'react'
import './HomeHeader.css';

function HomeHeader(props) {
    return (
        <div className="home-header-intro">
            <h1>Welcome back, {props.name}!</h1>
            <p>This is the home page for Fantasy Forecast. Use this as a central hub for 
                navigating the site! Check out the news feed to see the latest stories that
                your fellow forecasters have shared, or use any of the shortcuts to visit the 
                forecasting, learn, and profile pages or the leaderboards! (W:{props.width} H:{props.height})
            </p>
        </div>
    )
}

export default HomeHeader
