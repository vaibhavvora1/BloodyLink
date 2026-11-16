import React from 'react';

export default function ProfileCard({ user, onEdit }) {
  if (!user) return null;

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="premium-card p-4">
      <div className="d-flex align-items-center gap-3 mb-3">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-5"
          style={{ width: '56px', height: '56px', background: 'var(--gradient-primary)' }}
        >
          {initials}
        </div>
        <div>
          <h3 className="h5 fw-bold mb-1 text-dark">{user.name}</h3>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-light text-dark border text-capitalize">{user.role}</span>
            {user.bloodGroup && <span className="blood-badge py-1 px-2">{user.bloodGroup}</span>}
          </div>
        </div>
      </div>

      <div className="border-top pt-3 text-muted small">
        <div className="d-flex justify-content-between py-1">
          <span>City:</span>
          <span className="text-dark fw-medium">{user.city || 'Not specified'}</span>
        </div>
        <div className="d-flex justify-content-between py-1">
          <span>Contact:</span>
          <span className="text-dark fw-medium">{user.maskedPhone || '+91 98*** **000'}</span>
        </div>
      </div>

      {onEdit && (
        <button type="button" className="btn btn-sm btn-outline-secondary w-100 mt-3" onClick={onEdit}>
          <i className="bi bi-pencil me-1"></i> Edit Profile
        </button>
      )}
    </div>
  );
}
