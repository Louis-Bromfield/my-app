import React from 'react';
import './ClosedProblemModal.css';
import FFLogo from '../media/Icon.png';

const ConfirmationModal = ({ handleClose, justClose, show, children }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";

    return (
        <div className={showHideClassName}>
        <section className="modal-main">
            <img src={FFLogo} alt="" />
            <p>Are you sure you want to do this?</p>
            <button type="button" onClick={handleClose} className="close-modal2-btn">
                Yes
            </button>
            <button type="button" onClick={justClose} className="close-modal2-btn-close">
                No
            </button>
        </section>
        </div>
    );
};

export default ConfirmationModal;
