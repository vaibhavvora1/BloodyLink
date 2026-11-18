import React from 'react';
import Modal from 'react-bootstrap/Modal';
import StatusBadge from '../common/StatusBadge';

export default function DonationConfirmModal({ show, onHide, request, onConfirm, loading = false, success = false }) {
  if (!request) return null;
  return <Modal show={show} onHide={loading ? undefined : onHide} centered backdrop="static" aria-labelledby="donation-confirm-title">
    <Modal.Header closeButton={!loading && !success}><Modal.Title id="donation-confirm-title">{success ? 'Response submitted' : 'Confirm donation interest'}</Modal.Title></Modal.Header>
    <Modal.Body>
      {success ? <div className="text-center py-3"><i className="bi bi-check-circle-fill text-success display-5" /><p className="mt-3"><StatusBadge status="Pending Admin Approval" /></p><p className="text-muted mb-0">Your contact details stay private until an administrator approves the match.</p></div> : <>
        <p className="text-muted">Review this request before sending your interest. This does not confirm a final donation appointment.</p>
        <div className="donation-details-card"><div className="d-flex justify-content-between align-items-start gap-2 mb-3"><strong>Request status</strong><StatusBadge status={request.status || 'Requested'} /></div><div className="row g-3 small"><div className="col-6"><span className="text-muted d-block">Blood group</span><strong>{request.bloodGroup}</strong></div><div className="col-6"><span className="text-muted d-block">Units requested</span><strong>{request.units}</strong></div><div className="col-6"><span className="text-muted d-block">Hospital</span><strong>{request.hospital}</strong></div><div className="col-6"><span className="text-muted d-block">City</span><strong>{request.city}</strong></div><div className="col-6"><span className="text-muted d-block">Urgency</span><strong>{request.urgency}</strong></div><div className="col-6"><span className="text-muted d-block">Required date</span><strong>{new Date(request.requiredDate).toLocaleDateString()}</strong></div></div></div>
      </>}
    </Modal.Body>
    <Modal.Footer>{success ? <button type="button" className="btn btn-blood-primary" onClick={onHide}>Done</button> : <><button type="button" className="btn btn-outline-secondary" onClick={onHide} disabled={loading}>Cancel</button><button type="button" className="btn btn-blood-primary" onClick={onConfirm} disabled={loading}>{loading ? <><span className="spinner-border spinner-border-sm me-2" />Sending…</> : 'Confirm I want to donate'}</button></>}</Modal.Footer>
  </Modal>;
}
