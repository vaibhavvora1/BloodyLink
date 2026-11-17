import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';

export default function DonationConfirmModal({ show, onHide, donationData }) {
  const navigate = useNavigate();

  const handleNavigateDashboard = () => {
    onHide();
    navigate('/donor/dashboard');
  };

  if (!donationData) return null;

  const formattedDate = donationData.donationDate
    ? new Date(donationData.donationDate).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : new Date().toLocaleDateString();

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      keyboard={true}
      backdrop="static"
      className="donation-modal"
      aria-labelledby="donation-modal-title"
    >
      <div className="donation-modal-header text-center">
        <div className="donation-icon-wrapper" aria-hidden="true">
          <i className="bi bi-check-circle-fill text-success fs-1"></i>
        </div>
        <h2 id="donation-modal-title" className="h4 fw-bold text-dark mb-1">
          Donation Confirmed
        </h2>
        <p className="text-muted small mb-0">
          Thank you for helping save a life!
        </p>
      </div>

      <Modal.Body className="p-4">
        <div className="donation-details-card mb-3">
          <div className="row g-2 small">
            <div className="col-6">
              <span className="text-muted d-block">Patient Name:</span>
              <strong className="text-dark">{donationData.patientName}</strong>
            </div>
            <div className="col-6">
              <span className="text-muted d-block">Required Group:</span>
              <span className="badge bg-danger">{donationData.bloodGroup}</span>
            </div>
            <div className="col-6">
              <span className="text-muted d-block">Hospital:</span>
              <strong className="text-dark">{donationData.hospital}</strong>
            </div>
            <div className="col-6">
              <span className="text-muted d-block">City:</span>
              <strong className="text-dark">{donationData.city}</strong>
            </div>
            <div className="col-12 mt-2 pt-2 border-top">
              <span className="text-muted d-block">Appointment Timestamp:</span>
              <span className="fw-semibold text-dark">{formattedDate}</span>
            </div>
          </div>
        </div>

        <div className="donation-reminder-alert d-flex align-items-start gap-2">
          <i className="bi bi-info-circle-fill fs-5 flex-shrink-0 mt-1" aria-hidden="true"></i>
          <div>
            <strong>Important Preparation Reminder:</strong>
            <div className="mt-1">
              Please carry a government photo ID, drink plenty of water, and have a healthy meal before arriving at the center.
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 pb-4 px-4 d-flex justify-content-between">
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary px-3"
          onClick={onHide}
          aria-label="Close donation confirmation dialog"
        >
          Close
        </button>
        <button
          type="button"
          className="btn btn-sm btn-blood-primary px-3"
          onClick={handleNavigateDashboard}
          aria-label="Go to donor dashboard to view donations"
        >
          <i className="bi bi-grid-fill me-1"></i> View My Donations
        </button>
      </Modal.Footer>
    </Modal>
  );
}
