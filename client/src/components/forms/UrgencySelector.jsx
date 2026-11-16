import React from 'react';

const URGENCY_LEVELS = [
  { level: 'Immediate', desc: 'Critical (< 4h)' },
  { level: 'Urgent', desc: 'Within 24h' },
  { level: 'Normal', desc: 'Scheduled' }
];

export default function UrgencySelector({ value, onChange }) {
  return (
    <div className="mb-3 text-start">
      <label className="form-label small fw-semibold text-dark mb-1">Urgency Level</label>
      <div className="btn-group w-100" role="group">
        {URGENCY_LEVELS.map((u) => (
          <button
            key={u.level}
            type="button"
            className={`btn btn-sm ${value === u.level ? 'btn-danger' : 'btn-outline-secondary'}`}
            onClick={() => onChange(u.level)}
          >
            <span className="d-block fw-bold">{u.level}</span>
            <small style={{ fontSize: '11px' }}>{u.desc}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
