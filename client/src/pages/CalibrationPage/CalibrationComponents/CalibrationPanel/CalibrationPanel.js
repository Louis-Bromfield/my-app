import React, { useState } from 'react';
import './CalibrationPanel.css';
import CalibrationTabMenu from './CalibrationTabMenu';
import Questions from './Questions';

function CalibrationPanel() {
    const [menuOption, setMenuOption] = useState(0);
    const [panelStatus, setPanelStatus] = useState("Close");

    const moveToNextPage = (increaseAmount) => {
        setMenuOption(menuOption + increaseAmount);
    }

    const panelStatusButtonClick = (panelStatus) => {
        if (panelStatus === "Close") {
            setPanelStatus("Open");
        } else {
            setPanelStatus("Close");
        }
    }

    return (
        <div className="calibration-panel">
            <CalibrationTabMenu handleClick={setMenuOption} panelStatus={panelStatus} setPanelStatus={panelStatusButtonClick}/>
            {panelStatus === "Close" &&
                <Questions toRender={menuOption} toIncreaseRender={moveToNextPage} />
            }
            {panelStatus === "Open" &&
                <div></div>
            }
        </div>
    )
}

export default CalibrationPanel;
