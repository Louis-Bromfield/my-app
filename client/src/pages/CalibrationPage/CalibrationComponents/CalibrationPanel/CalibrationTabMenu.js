import React from 'react';
import './CalibrationTabMenu.css';

function CalibrationTabMenu(props) {

    return (
        <div className="calibration-tab-menu">
            <h3 className="calibration-tab-menu-option" onClick={() => {props.handleClick(1); props.setPanelStatus();}}>Calibration Intro</h3>
            <h3 className="calibration-tab-menu-option" onClick={() => {props.handleClick(2); props.setPanelStatus();}}>Forecast #1</h3>
            <h3 className="calibration-tab-menu-option" onClick={() => {props.handleClick(3); props.setPanelStatus();}}>Forecast #2</h3>
            <h3 className="calibration-tab-menu-option" onClick={() => {props.handleClick(4); props.setPanelStatus();}}>Forecast #3</h3>
            <h3 className="calibration-tab-menu-option" onClick={() => {props.handleClick(5); props.setPanelStatus();}}>Questions 1-10</h3>
            <h3 className="calibration-tab-menu-option" onClick={() => {props.handleClick(6); props.setPanelStatus();}}>Questions 11-17</h3>
            <button className="open-close-calibration-panel" onClick={() => props.setPanelStatus(props.panelStatus)}>{props.panelStatus}</button>
        </div>
    )
}

export default CalibrationTabMenu;
