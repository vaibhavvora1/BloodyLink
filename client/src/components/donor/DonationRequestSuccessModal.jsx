import React from 'react';
import { Modal } from 'react-bootstrap';
import StatusBadge from '../common/StatusBadge';

export default function DonationRequestSuccessModal({ request, onHide }) {
  return <Modal show={!!request} onHide={onHide} centered aria-labelledby="donation-request-success-title">
    <Modal.Header closeButton><Modal.Title id="donation-request-success-title">Donation request submitted</Modal.Title></Modal.Header>
    <Modal.Body>
      <p>Your request is waiting for admin review. It is not counted as available blood stock yet.</p>
      <div className="d-flex flex-wrap gap-3 align-items-center"><span className="blood-badge">{request?.bloodGroup}</span><StatusBadge status={request?.status || 'pending'} /><span>{request?.units || 1} unit</span></div>
      <p className="small text-muted mt-3 mb-0">{request?.center} · {request?.preferredDate ? new Date(request.preferredDate).toLocaleDateString() : ''}</p>
    </Modal.Body>
    <Modal.Footer><button type="button" className="btn btn-blood-primary" onClick={onHide}>Done</button></Modal.Footer>
  </Modal>;
}
