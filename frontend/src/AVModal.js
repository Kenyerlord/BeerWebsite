import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const AgeVerificationModal = ({ show, onClose }) => {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Age Verification</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>You must be 18 years or older to enter this site.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onClose}>
                    I am 18 or older
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AgeVerificationModal;