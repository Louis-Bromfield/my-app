import React, { useState } from 'react';
import ForecastArticlesDisplay from './ForecastArticlesDisplay';
import ForecastProblemLineChart from './ForecastProblemLineChart';
import ForecastMarketLeaderboard from './ForecastMarketLeaderboard';
import ForecastStatistics from './ForecastStatistics';
import MarketStatistics from './MarketStatistics';
import './ForecastTabPaneDisplay.css';

function ForecastTabPaneDisplay(props) {
    const [todayAverage, setTodayAverage] = useState("");
    const [todayForecastCount, setTodayForecastCount] = useState("");

    const updateTodayStats = (avg, fc) => {
        setTodayAverage(avg);
        setTodayForecastCount(fc);
    };

    return (
        <div className="forecast-tab-pane-display">
            {props.chosenTab === "default" &&
                <div className="default-div">
                    <h3>Select from one of the above tabs</h3>
                </div>
            }
            {props.chosenTab === "articles" &&
                <div className="articles-div">
                    <ForecastArticlesDisplay 
                        searchTerm={props.selectedForecast.problemName}
                        market={props.selectedForecast.market}
                    />
                </div>
            }
            {props.chosenTab === "forecastStats" &&
                <div className="forecast-stats-div">
                    <div className="forecast-stats-div-line-chart">
                        <ForecastProblemLineChart 
                            selectedForecast={props.selectedForecast} 
                            updateTodayStats={updateTodayStats} 
                            username={props.username} 
                            refresh={props.refresh} 
                            forecastSingleCertainty={props.forecastSingleCertainty}
                        />
                    </div>
                    <div className="forecast-stats-div-four-container">
                        <ForecastMarketLeaderboard 
                            market={props.selectedForecast.market} 
                            leaderboard={props.leaderboard} 
                            username={props.username} 
                        />
                        <ForecastStatistics 
                            selectedForecast={props.selectedForecast} 
                            today={false} 
                            forecastSingleCertainty={props.forecastSingleCertainty}
                        />
                        <ForecastStatistics 
                            selectedForecast={props.selectedForecast} 
                            today={true} 
                            todayAverage={todayAverage} 
                            todayForecastCount={todayForecastCount} 
                            forecastSingleCertainty={props.forecastSingleCertainty}
                        />
                        <MarketStatistics 
                            leaderboard={props.leaderboard} 
                            username={props.username} 
                            refresh={props.refresh} 
                            market={props.selectedForecast.market}
                        />
                    </div>
                </div>
            }
        </div>
    )
}

export default ForecastTabPaneDisplay;
